import { Container } from "@/components/ui/section";

export function PilotStatus() {
  return (
    <section aria-labelledby="status-h" className="py-12">
      <Container>
        <div className="rounded-3xl border border-line bg-mint p-7 sm:p-9">
          <p className="text-xs font-extrabold tracking-[0.14em] text-teal uppercase">Pilot status</p>
          <h2 id="status-h" className="mt-2 text-2xl font-black sm:text-3xl">
            In development — registration is not open.
          </h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-ink/85">
            Young Problem Solvers is an educational pilot in development. The curriculum is not officially accredited and
            its learning outcomes have not been validated. Venue, fees, timetable and enrollment have not been finalized.
            We are building the curriculum, training approach and assessments carefully before opening enrollment.
          </p>
        </div>
      </Container>
    </section>
  );
}
