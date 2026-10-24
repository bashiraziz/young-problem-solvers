import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LessonHeader, LessonNav, PrintLinks, lessonHref, lessonNumber } from "@/components/learning/lesson-parts";
import { PracticeSet } from "@/components/learning/practice-set";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/section";
import { UNIT_1_LESSONS, getLesson, getNeighbours } from "@/content/foundation";
import { practiceFor } from "@/content/foundation/unit-1-items";

export const dynamicParams = false;

export function generateStaticParams() {
  return UNIT_1_LESSONS.map((l) => ({ id: l.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const lesson = getLesson((await params).id);
  return lesson ? { title: `Practice ${lessonNumber(lesson)}: ${lesson.title}`, description: `Independent practice for ${lesson.title}.` } : {};
}

export default async function PracticePage({ params }: { params: Promise<{ id: string }> }) {
  const lesson = getLesson((await params).id);
  if (!lesson) notFound();
  const { prev, next } = getNeighbours(lesson.slug);
  const practice = practiceFor(lesson);

  return (
    <>
      <LessonHeader lesson={lesson} kind="practice" mascot="thinking" />

      <Container className="space-y-12 pb-16">
        <PracticeSet
          sections={[
            {
              id: "practice",
              title: "Independent practice",
              intro: practice.interactive
                ? "Work each question on paper first if you like, then type your answer. Show your thinking. There are no scores and no timers."
                : "Work each question on paper or here. Interactive checking for this lesson is coming later; use the printable workbook for now.",
              items: practice.practice,
              numbered: true,
            },
            { id: "challenge", title: "Stretch challenge", items: [practice.challenge] },
            { id: "exit", title: "Exit ticket", intro: "One last question to show what you understood today.", items: [practice.exit] },
          ]}
        />

        <section aria-labelledby="print-h" className="rounded-3xl bg-mint p-6 sm:p-8">
          <h2 id="print-h" className="text-2xl font-black tracking-tight">Prefer paper?</h2>
          <p className="mt-2 max-w-2xl">The workbook has space to show your working. Print it on A4.</p>
          <div className="mt-5">
            <PrintLinks lesson={lesson} />
          </div>
          <div className="mt-5">
            <Button href={lessonHref(lesson)} variant="outline">← Back to the lesson</Button>
          </div>
        </section>

        <LessonNav prev={prev} next={next} kind="practice" />
      </Container>
    </>
  );
}
