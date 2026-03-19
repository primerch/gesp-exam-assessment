import OpenAI from "openai";

// 使用动态导入来处理 pdf2json
async function getPDFParser() {
  const pdf2json = await import("pdf2json");
  return pdf2json.default || pdf2json;
}

// 初始化 DeepSeek 客户端（兼容 OpenAI API 格式）
const getDeepSeekClient = () => {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error("DEEPSEEK_API_KEY is not set");
  }
  
  return new OpenAI({
    apiKey: apiKey,
    baseURL: "https://api.deepseek.com/v1", // DeepSeek API 地址
  });
};

// 分析试卷的请求类型
export interface ExamAnalysisRequest {
  pdfBuffer: Buffer; // PDF 文件 Buffer
  examLevel: number; // 试卷声称的 GESP 级别 (1-8)
  studentLevel: number; // 学生当前课程级别 (1-4)
  studentLesson: number; // 学生当前课程进度
}

// 超纲知识点类型
export interface BeyondKnowledgePoint {
  name: string;
  gespLevel: number; // 该知识点实际属于的 GESP 级别
  reason: string; // 为什么认为超纲
  questionContext?: string; // 在试卷中的上下文
}

// 分析结果类型
export interface ExamAnalysisResult {
  difficultyScore: number; // 难度系数 1-10
  isBeyondSyllabus: boolean; // 是否超纲
  beyondPoints: BeyondKnowledgePoint[]; // 超纲知识点列表
  parentFeedback: string; // 给家长的反馈文案
  summary: string; // 总体评价
  confidence: number; // AI 分析的置信度 0-1
}

// 提取 PDF 文本
export async function extractPdfText(pdfBuffer: Buffer): Promise<string> {
  try {
    const PDFParser = await getPDFParser();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfParser = new (PDFParser as any)(null, 1);
    
    return new Promise((resolve, reject) => {
      pdfParser.on("pdfParser_dataError", (errData: { parserError: Error }) => {
        reject(new Error(`PDF 解析错误: ${errData.parserError.message}`));
      });
      
      pdfParser.on("pdfParser_dataReady", (pdfData: { Pages: Array<{ Texts: Array<{ R: Array<{ T: string }> }> }> }) => {
        try {
          let text = "";
          for (let i = 0; i < pdfData.Pages.length; i++) {
            const page = pdfData.Pages[i];
            text += `\n--- Page ${i + 1} ---\n`;
            
            for (const textItem of page.Texts) {
              for (const r of textItem.R) {
                // decodeURIComponent 用于解码 URI 编码的字符
                try {
                  text += decodeURIComponent(r.T) + " ";
                } catch {
                  text += r.T + " ";
                }
              }
            }
            text += "\n";
          }
          resolve(text);
        } catch (error) {
          reject(new Error("提取 PDF 文本时出错"));
        }
      });
      
      pdfParser.parseBuffer(pdfBuffer);
    });
  } catch (error) {
    console.error("PDF 解析初始化错误:", error);
    throw new Error("PDF 解析模块加载失败");
  }
}

// 构建分析 Prompt
function buildAnalysisPrompt(
  examLevel: number,
  studentLevel: number,
  studentLesson: number,
  pdfText: string
): string {
  return `你是一位专业的 GESP (CCF 编程能力等级认证) C++ 考试分析师。请仔细分析以下试卷内容，并与 GESP ${examLevel} 级官方大纲进行对比。

## 学生背景信息
- 学生当前课程级别: Level ${studentLevel}
- 已完成课程进度: 第 ${studentLesson} 课

## GESP 各级别大纲参考

### GESP 一级
- 计算机基础、IDE使用
- 基础语法：cin/cout、scanf/printf、变量定义
- 数据类型：int、long long、float、double、char、bool
- 运算：算术(+,-,*,/,%)、关系(>,<,==,!=)、逻辑(&&,||,!)
- 程序结构：顺序、分支(if/switch)、循环(for/while)

### GESP 二级
- 计算机存储与网络、流程图、ASCII编码
- 数据类型转换、多层分支/循环嵌套
- 数学函数：abs、sqrt、max、min、rand

### GESP 三级
- 数据编码(原码/反码/补码)、进制转换、位运算(&,|,~,^,<<,>>)
- 一维数组、字符串及函数
- 枚举算法、模拟算法

### GESP 四级
- 函数定义与调用、指针基础、结构体
- 二维数组、递推算法
- 排序算法：冒泡、插入、选择
- 算法复杂度、文件操作

### GESP 五级
- 初等数论、高精度运算、素数筛法
- 链表、二分查找/二分答案
- 贪心算法、分治算法(归并/快排)、递归

### GESP 六级
- 树、哈夫曼树、完全二叉树、二叉排序树
- 哈夫曼编码、格雷编码
- DFS、BFS、二叉树搜索
- 动态规划基础、栈和队列、面向对象

### GESP 七级
- 数学库函数(sin,cos,log,exp)
- 复杂动态规划(二维DP、DP优化)
- 图论：图的定义、遍历、图DFS/BFS、泛洪算法
- 哈希表、计数原理、排列组合、杨辉三角

### GESP 八级
- 倍增法
- 最小生成树(Kruskal、Prim)
- 最短路径(Dijkstra、Floyd)
- 图论综合应用、算法优化

## 试卷内容
\`\`\`
${pdfText.slice(0, 15000)} // 限制文本长度，避免超出 token 限制
\`\`\`

## 分析任务
请仔细分析试卷的每一道题目，判断：
1. 难度系数 (1-10)：相对于 GESP ${examLevel} 级的标准难度
2. 是否有超纲内容：超出 GESP ${examLevel} 级大纲的知识点
3. 具体超纲知识点：列出每个超纲知识点的名称、实际所属级别、超纲原因

## 输出格式
请以 JSON 格式返回，不要包含其他文字：
{
  "difficultyScore": 数字(1-10),
  "isBeyondSyllabus": true/false,
  "beyondPoints": [
    {
      "name": "知识点名称",
      "gespLevel": 数字(1-8),
      "reason": "超纲原因",
      "questionContext": "题目上下文"
    }
  ],
  "parentFeedback": "给家长的正式反馈文案（中文，专业友好的语气）",
  "summary": "总体评价（中文）",
  "confidence": 数字(0-1)
}

## 给学管老师的反馈文案要求
- 语气委婉、温和，避免过于强硬或批评性语言
- 从鼓励学生的角度出发，肯定学生的努力和现有水平
- 说明试卷整体难度评估时，用客观描述而非主观评判
- 如果有超纲内容，用"涉及了一些进阶知识点"、"可以提前了解"等委婉表达，避免"超纲"、"未掌握"等负面词汇
- 建议学习方向时，用"建议逐步学习"、"可以循序渐进地接触"等积极表达
- 文案格式为纯文本，不要使用 markdown 格式（不要加 ** 等符号）
- 整体风格：温和、鼓励、建设性，让家长感受到机构的专业和对学生的关心

## 注意事项
- 只分析 C++ 相关内容，忽略 Python 或其他语言内容
- 严格按照 C++11 标准判断语法要求
- 如果题目涉及多个知识点，请分别判断每个知识点是否超纲`;
}

// 分析试卷主函数
export async function analyzeExam(
  request: ExamAnalysisRequest
): Promise<ExamAnalysisResult> {
  const client = getDeepSeekClient();
  
  // 1. 提取 PDF 文本
  console.log("正在提取 PDF 文本...");
  const pdfText = await extractPdfText(request.pdfBuffer);
  
  if (!pdfText || pdfText.trim().length === 0) {
    throw new Error("PDF 文件无法提取文本，可能是扫描件或图片 PDF");
  }
  
  console.log(`PDF 提取成功，文本长度: ${pdfText.length} 字符`);

  // 2. 构建 Prompt
  const prompt = buildAnalysisPrompt(
    request.examLevel,
    request.studentLevel,
    request.studentLesson,
    pdfText
  );

  // 3. 调用 DeepSeek API
  try {
    console.log("正在调用 DeepSeek API 分析...");
    
    const completion = await client.chat.completions.create({
      model: "deepseek-chat", // DeepSeek-V3 模型
      messages: [
        {
          role: "system",
          content: "你是一位专业的 GESP C++ 考试分析师，擅长分析试卷难度和判断是否超纲。请严格按照要求输出 JSON 格式。"
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.1, // 低温度以获得更确定的结果
      max_tokens: 4096,
    });

    const responseText = completion.choices[0]?.message?.content;
    
    if (!responseText) {
      throw new Error("DeepSeek API 返回空响应");
    }

    console.log("DeepSeek API 响应成功，正在解析...");

    // 4. 提取 JSON
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("AI 返回内容:", responseText);
      throw new Error("无法解析 AI 返回的结果格式");
    }

    const analysisResult: ExamAnalysisResult = JSON.parse(jsonMatch[0]);
    
    // 5. 验证结果格式
    if (typeof analysisResult.difficultyScore !== 'number' ||
        typeof analysisResult.isBeyondSyllabus !== 'boolean' ||
        !Array.isArray(analysisResult.beyondPoints)) {
      console.error("解析后的结果:", analysisResult);
      throw new Error("AI 返回的结果格式不正确");
    }

    console.log("分析完成");
    return analysisResult;

  } catch (error) {
    console.error("DeepSeek API 调用失败:", error);
    
    if (error instanceof Error) {
      if (error.message.includes("401")) {
        throw new Error("API Key 无效，请检查 DEEPSEEK_API_KEY 配置");
      }
      if (error.message.includes("429")) {
        throw new Error("API 调用频率超限或免费额度已用完");
      }
      throw new Error(`分析失败: ${error.message}`);
    }
    
    throw new Error("试卷分析过程中发生未知错误");
  }
}

// 简单的健康检查
export async function checkDeepSeekHealth(): Promise<boolean> {
  try {
    const client = getDeepSeekClient();
    await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [{ role: "user", content: "Hello" }],
      max_tokens: 5,
    });
    return true;
  } catch {
    return false;
  }
}
