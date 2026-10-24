import type { ReactNode } from "react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`mx-auto w-[min(1170px,calc(100%-2rem))] sm:w-[min(1170px,calc(100%-4rem))] ${className}`}>
      {children}
    </div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-xs font-extrabold tracking-[0.14em] text-teal uppercase">{children}</p>;
}

interface SectionHeadProps {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  id?: string;
  center?: boolean;
}

export function SectionHead({ eyebrow, title, children, id, center }: SectionHeadProps) {
  return (
    <div className={`mb-10 max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 id={id} className="mt-3 text-3xl leading-tight font-black tracking-tight text-balance sm:text-5xl">
        {title}
      </h2>
      {children && <p className="mt-4 text-lg leading-relaxed text-muted">{children}</p>}
    </div>
  );
}
