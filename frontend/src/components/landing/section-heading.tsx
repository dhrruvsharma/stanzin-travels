import { cn } from "@/src/lib/utils";
import { Reveal } from "./reveal";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  dark?: boolean;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  dark = false,
  className,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <p
        className={cn(
          "mb-4 flex items-center gap-3 text-xs font-semibold tracking-[0.28em] uppercase",
          align === "center" && "justify-center",
          dark ? "text-primary" : "text-saffron",
        )}
      >
        <span aria-hidden className="flag-stripe h-0.5 w-10 rounded-full" />
        {eyebrow}
      </p>
      <h2
        className={cn(
          "font-display text-4xl leading-[1.05] font-medium text-balance sm:text-5xl",
          dark ? "text-bone" : "text-foreground",
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-5 text-base leading-relaxed sm:text-lg",
            dark ? "text-bone/70" : "text-muted-foreground",
          )}
        >
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}
