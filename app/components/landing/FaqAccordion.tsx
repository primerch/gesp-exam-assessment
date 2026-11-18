import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/app/components/ui/accordion";

const faqs = [
  ["这是 CCF 官方工具吗？", "不是。GESP 考级宝是 Reacher 独立作品，考纲内容与原文链接来自中国计算机学会，分析结果不代表 CCF 官方结论。"],
  ["目前支持哪些考试语言和等级？", "当前支持 C++ 一级至八级。考纲页可以逐级切换，进入试卷分析时会保留所选等级。"],
  ["可以上传哪些 PDF 试卷？", "支持文字版、扫描件和包含图示的 PDF，单次最多 64 页、10 MB。加密或损坏的文件会显示明确的读取错误。"],
  ["怎么判断一道题是否超纲？", "看完成这道题最少需要哪些知识。可选解法、干扰项和题目本身的问题会单独注明，不会因为存在更复杂的解法就判成超纲。"],
  ["学习规划里的百分比是什么意思？", "它是根据课程进度与知识覆盖算出的准备程度估算，不是考试通过率。实际报考能力仍需结合独立作答表现。"],
  ["分析报告可以保存或打印吗？", "可以。分析报告保留题目、考点、得分要点和依据，并提供适合打印的版面；署名与学习进度为选填信息。"],
];

export default function FaqAccordion() {
  return (
    <Accordion type="single" collapsible defaultValue="item-0" className="border-t border-line">
      {faqs.map(([question, answer], index) => (
        <AccordionItem key={question} value={`item-${index}`} data-faq>
          <AccordionTrigger className="min-h-16 text-base font-medium text-ink hover:no-underline">
            {question}
          </AccordionTrigger>
          <AccordionContent className="max-w-3xl pr-8 pb-6 text-sm leading-7 text-muted">
            {answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
