# GESP 考级宝「Orbit 证据剧场」UI 改版设计

## 意图

现有首页约 6700px，重复介绍考纲、试卷分析和学习规划。此次改版不做一个“更克制的企业官网”，而是直接采用 MotionSites 免费 landing 的视觉语言，做出用户明确要求的动态表现力，同时让选课报考和试卷分析更容易使用。

## 已确定的体验方向

- 首页需要介绍产品，而且要炫技。
- **以实际打开并确认 Free 的 [Orbit Flora](https://motionsites.org/prompts/orbit-flora) 为 landing 基底**，不是只参考一句构图建议。
- 需要组件时再使用更炫酷的 shadcn 生态 registry；基础 Select、Tabs 不作为设计方案。
- 只改 UI 与交互呈现，不改程序逻辑。

## 目标

- 首屏直接形成强视觉记忆：全屏深色、超大 GESP 字、中心立体试卷装置、入场编排、鼠标 morph-reveal。
- 用“试卷 → 考点 → CCF 证据”取代 Orbit Flora 的花朵主体，让炫技仍然表达产品思想。
- 首页第二屏提供两个清楚入口：课程进度与参考报考、PDF 试卷分析；不再重复整套功能演示。
- `/plan` 先回答“学到哪、参考报哪级”，再展开课程讲点与来源。
- `/analyze` 先呈现文件、对照标准和真实分析状态，再呈现报告摘要和逐题证据。

## 非目标与边界

- 不修改模型提示词、API、分析流程、数据结构、课程映射、概率算法、超纲判定逻辑或评分逻辑。
- 不新增年份、场次、出版社或自动目标等级识别。试卷信息只展示当前已有的文件名、页数、语言、对照等级、题数和备注。
- 不新增登录、收藏、历史报告、云端上传或持久化。
- 不重写 `/syllabus` 内容模型，只统一共享导航和组件语言。
- 不全量安装 registry，只引入实际使用的组件并检查依赖与许可。

## 反目标

- 不再用功能卡、步骤、FAQ、方法说明、重复 CTA 拼成长 landing page。
- 不把 Luminous Topo 或其他 Paid 方向当作免费方案；已实际确认其为 Paid，不使用。
- 不用通用机器人、大脑、紫色星云或花朵素材代替 GESP 内容。
- 不用假数据冒充真实识别结果，不用虚假百分比伪造分析进度。
- 不让动画妨碍选课、上传、阅读、打印、键盘操作或减少动态效果设置。

## 方案比较

### Orbit 证据剧场（已选择）

采用 Orbit Flora 的全屏 poster、超大衬线字、中心主体和鼠标 morph-reveal。中心主体换成有纵深的试卷与考纲纸层，第二层再进入真实任务。视觉最强，也能直接表达产品。

### AI runtime

已实际打开并确认 Free。矩阵代码和球体视频很炫，但更像通用 AI 平台，缺少试卷、考纲和证据关系，因此不选。

### AI Chatbot Agent Header / AI Sales Call Analyzer Header

两者均已实际打开并确认 Free。关系图和分析面板可借鉴到产品内部，但作为首页主体偏普通 SaaS，因此不作为 landing 基底。

## 首页设计

### 第一幕：Orbit 全屏海报

- Header 在首页切换为深色透明融合样式，其他页面保留现有浅色导航。
- 背景使用近黑墨绿，不用紫色。
- 超大 `GESP` 衬线字横穿首屏，中文标题与两个行动入口置于下方或侧下缘，避免长篇副标题。
- 中央不是图片花朵，而是 CSS/SVG 构成的立体纸层装置：
  - 底层为 CCF 考纲页与真实页码标记。
  - 中层为代码题面和考点批注。
  - 上层为分析结论章与证据连接线。
  - 纸层有透视、厚度、遮蔽和少量景深，不能只是三张平面 Card。
- 入场按 Orbit Flora 的编排方式：大字、纸层、导航与边角文案分批出现，只播放一次。
- 鼠标移动驱动纸层视差和局部 morph-reveal：未交互时看到完整试卷，指针靠近后显露对应考点与 CCF 条款；触摸设备提供点击切换。
- 主行动为「选择学习进度」和「上传试卷」，等级考纲保留为次级文字链接。

### 第二幕：两个真实任务，不做功能宣传卡墙

- **课程路径**：用 Level 1–4 的连续轨道与 GESP 等级节点表达学习进程；一个 Level 1 第 12 课真实示例调用现有计算函数，展示参考结果与估算限制。
- **试卷证据**：用一个紧凑的逐题报告切片展示文件信息、判定计数与 CCF 页码；明确标注演示，不伪装成用户报告。
- 两个入口均可点击进入对应页面，不再在首页嵌入完整第三套工作台。
- 页脚前仅保留一条说明：结论附 CCF 原文与页码，课程估算不代表考试成绩。

首页目标为约两个主要视口高度，删除当前重复 HeroWorkspace、ToolPanels、ProcessStepper、SyllabusTabs、AnalysisDemo、CourseTimeline、FAQ 和重复 CTA。

## 学习规划 `/plan`

- 顶部直接问「你学到哪了？」，不再放长介绍。
- 四个课程阶段用连续轨道选择；课次用可搜索选择器、上一课/下一课与快捷定位。
- 第一屏主结果展示当前课程、课次、现有 `getRecommendedExam` 推荐等级和 `calculatePassProbability` 估算；空推荐如实呈现。
- 等级结果使用动态路径和数字变化，不用八张等宽统计卡。
- 当前课讲点、来源和覆盖条款收进次级展开区，保留全部 CCF 证据。
- 只组合现有函数返回值，不修改函数。

## 试卷分析 `/analyze`

- 上传区改为有扫描框、拖放响应和文件 morph 状态的单文件工作台；目标等级与开始分析仍使用现有状态。
- 对照标准改为紧凑摘要，本级考点可展开。
- 分析中只根据现有状态文本改变扫描与阶段视觉，保留取消、错误处理，不制造百分比。
- 报告顶部建立「这份试卷」身份区：文件名、页数、语言、对照等级、识别题数、修订版本。
- 判定计数可点击筛选并带数字过渡；分值、考点和反馈仍来自现有计算。
- 逐题证据可展开，并可用 morphing dialog 聚焦阅读；试卷页码和 CCF 链接保持主要地位。
- 打印、教学反馈和复制功能保留。

## 动效 registry 的具体使用

- Magic UI [`animated-beam`](https://magicui.design/docs/components/animated-beam)：题目、考点、CCF 条款之间的动态证据线。
- Magic UI [`number-ticker`](https://magicui.design/docs/components/number-ticker)：真实示例和报告判定计数。
- Magic UI [`border-beam`](https://magicui.design/docs/components/border-beam)：只用于 PDF 拖放激活和分析进行中的边界，不铺满所有卡片。
- Magic UI [`particles`](https://magicui.design/docs/components/particles)：首屏少量代码尘埃，响应指针并降低密度；减少动态效果时移除。
- motion-primitives [`tilt`](https://motion-primitives.com/docs/tilt)：中央试卷装置的指针纵深，限制旋转角度，不影响文字阅读。
- motion-primitives [`spotlight`](https://motion-primitives.com/docs/spotlight)：试卷装置和文件工作台的局部照亮，不使用全页追光。
- motion-primitives [`text-morph`](https://motion-primitives.com/docs/text-morph)：「读取题目 → 对照考点 → 形成结论」的短状态切换。
- motion-primitives [`transition-panel`](https://motion-primitives.com/docs/transition-panel)：独立演示题卡、课程结果和报告摘要的过渡。
- motion-primitives [`morphing-dialog`](https://motion-primitives.com/docs/morphing-dialog)：逐题证据聚焦；必须验证 Escape、焦点管理、关闭按钮和移动端，否则退回普通展开面板。
- ReUI [`file-upload`](https://reui.io/components/file-upload) 与 [`file-type`](https://reui.io/components/file-type/c-file-type-8)：PDF 拖放、校验和文件卡，接入现有回调，不改变文件处理流程。

基础 shadcn 控件仅作无障碍内部结构，不作为视觉卖点。

## 可访问性与性能

- 使用项目已有 Framer Motion；新组件引入前检查 React 19、Next.js 16、Tailwind 4 和 Cloudflare 构建兼容性。
- 动画以 transform、opacity、SVG 路径进度为主；限制粒子数量和 Canvas 工作，页面不可见时暂停。
- `prefers-reduced-motion` 下取消粒子、视差、数字补间和自动入场，直接显示完整静态证据关系。
- 所有动态内容有文本等价物，键盘可完成全部任务；移动设备用点击替代 hover。
- 移动端保留大字与纸层构图，但简化层数和装饰，不缩小成不可读的桌面画面。

## 实施归属与验证

主要修改首页 landing 组件、Header、`app/plan/page.tsx`、`PaperWorkspace.tsx`、`ExamAnalysisResult.tsx`、`PdfUploader.tsx` 和新增受审 registry 组件。更新 landing 测试以覆盖新内容、真实链接和可访问静态输出；逻辑测试不变。

验证：

- `bun test tests`
- `npm run lint`
- `npm run build`
- 浏览器走通首页入口、课程切换、PDF 选择、目标等级、错误/取消、报告筛选、证据展开、原文链接和打印。
- 检查桌面、移动端、键盘、减少动态效果、长文件名、无推荐、无分值和依据不足。
- 交付真实改版截图和可访问的本地预览。
