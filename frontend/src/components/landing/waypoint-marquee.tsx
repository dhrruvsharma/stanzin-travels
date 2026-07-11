import { MARQUEE_STOPS } from "@/src/lib/site-data";

const FLAG_COLORS = [
  "bg-flag-blue",
  "bg-bone",
  "bg-flag-red",
  "bg-flag-green",
  "bg-flag-yellow",
];

function MarqueeRun() {
  return (
    <>
      {MARQUEE_STOPS.map((stop, i) => (
        <span key={stop} className="flex items-center gap-6">
          <span className="text-sm font-semibold tracking-[0.2em] whitespace-nowrap text-bone/80 uppercase">
            {stop}
          </span>
          <span
            aria-hidden
            className={`size-2 rotate-45 ${FLAG_COLORS[i % FLAG_COLORS.length]}`}
          />
        </span>
      ))}
    </>
  );
}

/** Endless ticker of the waypoints Namsras drives, in prayer-flag colours. */
export function WaypointMarquee() {
  return (
    <div className="overflow-hidden border-y border-white/10 bg-ink py-4">
      <div className="animate-marquee flex w-max items-center">
        <div className="flex items-center gap-6 pr-6">
          <MarqueeRun />
        </div>
        <div aria-hidden className="flex items-center gap-6 pr-6">
          <MarqueeRun />
        </div>
      </div>
    </div>
  );
}
