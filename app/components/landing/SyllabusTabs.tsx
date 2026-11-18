import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/components/reui/badge";
import { catalogFor, levelNames, levels } from "../../data/official-syllabus";
import { syllabusHref } from "../../lib/syllabus-links";
import { unitTitles } from "../SyllabusBrowser";

export default function SyllabusTabs() {
  return (
    <Tabs defaultValue="1" className="w-full">
      <div className="overflow-x-auto pb-2">
        <TabsList className="min-w-max bg-wash">
          {levels.map((level) => (
            <TabsTrigger key={level} value={String(level)} className="min-w-16">
              {levelNames[level]}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {levels.map((level) => {
        const entries = catalogFor(level).filter((entry) => entry.kind === "topic" && entry.level === level);
        return (
          <TabsContent key={level} value={String(level)}>
            <Card className="border-line bg-surface shadow-none">
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <CardTitle as="h3" className="text-2xl font-medium tracking-[-0.02em]">{unitTitles.cpp[level]}</CardTitle>
                    <CardDescription className="mt-2">GESP {levelNames[level]} · {entries.length} 项考点</CardDescription>
                  </div>
                  <Badge variant="primary-light" size="lg">当前查看</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="grid gap-3 text-sm text-muted sm:grid-cols-2">
                  {entries.slice(0, 4).map((entry) => (
                    <li key={entry.id} className="border-b border-line pb-3">{entry.title}</li>
                  ))}
                </ul>
                <Link href={syllabusHref(level)} className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline">
                  查看本级完整条款 <ArrowUpRight size={14} aria-hidden />
                </Link>
              </CardContent>
            </Card>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
