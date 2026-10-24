import Image from "next/image";

export const MASCOT_POSES = ["default", "thinking", "got-it", "stuck", "explaining"] as const;
export type MascotPose = (typeof MASCOT_POSES)[number];

interface MascotProps {
  pose: MascotPose;
  size?: number;
  className?: string;
  /** Only pass a label if the picture carries meaning the words do not. The mascot is decoration by default. */
  label?: string;
}

/** The YPS robot. Decorative: the words on the page carry the meaning, so the alt text is empty unless `label` is given. */
export function Mascot({ pose, size = 160, className, label }: MascotProps) {
  return (
    <Image
      src={`/mascot/robot-${pose}.svg`}
      alt={label ?? ""}
      width={size}
      height={size}
      data-mascot={pose}
      className={className}
    />
  );
}
