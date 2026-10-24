import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LessonHeader, LessonNav, PrintLinks, lessonNumber, practiceHref } from "@/components/learning/lesson-parts";
import { PracticeSet } from "@/components/learning/practice-set";
import { EstimateTable, PlaceValueTable } from "@/components/learning/visuals";
import { WorkedExample } from "@/components/learning/worked-example";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/section";
import { UNIT_1_LESSONS, getLesson, getNeighbours, type Lesson } from "@/content/foundation";
import { practiceFor } from "@/content/foundation/unit-1-items";

export const dynamicParams = false;

export function generateStaticParams() {
  return UNIT_1_LESSONS.map((l) => ({ id: l.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const lesson = getLesson((await params).id);
  return lesson ? { title: `Lesson ${lessonNumber(lesson)}: ${lesson.title}`, description: lesson.question } : {};
}

/** Pictures for the worked example, where the lesson has one. Numbers match the worked example in the content file. */
function visualFor(lesson: Lesson) {
  if (lesson.id === "YPS-F1-U1-L01") return <PlaceValueTable numbers={[24_650, 24_560]} />;
  if (lesson.id === "YPS-F1-U1-L02") return <EstimateTable terms={[4_800, 6_300]} nearest={1_000} />;
  return undefined;
}

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const lesson = getLesson((await params).id);
  if (!lesson) notFound();
  const { prev, next } = getNeighbours(lesson.slug);
  const practice = practiceFor(lesson);

  return (
    <>
      <LessonHeader lesson={lesson} kind="lesson" mascot="explaining" />

      <Container className="space-y-12 pb-16">
        <section aria-labelledby="idea-h" className="rounded-3xl border border-line bg-white p-6 sm:p-8">
          <h2 id="idea-h" className="text-2xl font-black tracking-tight">The big idea</h2>
          <p className="mt-3 max-w-3xl text-lg leading-relaxed">{lesson.keyidea}</p>
        </section>

        <section aria-labelledby="learn-h">
          <h2 id="learn-h" className="mb-4 text-2xl font-black tracking-tight">Learn it</h2>
          <WorkedExample steps={lesson.worked_steps} example={lesson.model} visual={visualFor(lesson)} />
        </section>

        <PracticeSet
          sections={[
            {
              id: "guided",
              title: "Try it with help",
              intro: practice.interactive
                ? "Hints show you the method. They never give the answer away."
                : "Think about these with a partner or on paper. Interactive checking for this lesson is coming later.",
              items: practice.guided,
              numbered: true,
            },
          ]}
        />

        <section aria-labelledby="next-h" className="rounded-3xl bg-mint p-6 sm:p-8">
          <h2 id="next-h" className="text-2xl font-black tracking-tight">Ready to practise on your own?</h2>
          <p className="mt-2 max-w-2xl">Six practice questions, a stretch challenge and an exit ticket. Or print the workbook and write on paper.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button href={practiceHref(lesson)}>Go to practice →</Button>
          </div>
          <div className="mt-6">
            <PrintLinks lesson={lesson} />
          </div>
        </section>

        <LessonNav prev={prev} next={next} kind="lesson" />
      </Container>
    </>
  );
}
