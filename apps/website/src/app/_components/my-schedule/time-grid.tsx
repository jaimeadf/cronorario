import {
  createContext,
  forwardRef,
  HTMLAttributes,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

const MINUTES_PER_HOUR = 60;
const MINUTES_PER_DAY = 24 * MINUTES_PER_HOUR;

interface TimeGridContextProps {
  viewHeight: number;
  viewTimeTicks: number[];
  viewTimeRange: TimeGridRelativeTimeRange;
}

interface TimeGridColumnProps extends HTMLAttributes<HTMLDivElement> {}
interface TimeGridColumnHeadingProps extends HTMLAttributes<HTMLDivElement> {}
interface TimeGridColumnBodyProps extends HTMLAttributes<HTMLDivElement> {}
interface TimeGridTimeRulersProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {}

interface TimeGridEventCardProps {
  event: TimeGridEvent;
}

interface TimeGridEventFrameProps {
  events: TimeGridEvent[];
}

interface TimeGridTimelineColumnProps {
  title: string;
  groups: TimeGridEvent[][];
}

interface TimeGridProps {
  timelines: string[];
  events: TimeGridEvent[];
}

export interface TimeGridRelativeTimeRange {
  startMinutes: number;
  endMinutes: number;
}

export interface TimeGridEvent {
  title: string;
  description: string;
  timeline: string;
  time: TimeGridRelativeTimeRange;
}

const TimeGridContext = createContext({} as TimeGridContextProps);

function TimeGridColumn({
  children,
  className,
  ...props
}: TimeGridColumnProps) {
  return (
    <div {...props} className={cn("flex flex-col", className)}>
      {children}
    </div>
  );
}

function TimeGridColumnHeading({
  children,
  className,
  ...props
}: TimeGridColumnHeadingProps) {
  return (
    <div
      {...props}
      className={cn(
        "sticky top-0 z-10 flex h-10 items-center justify-center",
        "border-b border-primary bg-primary",
        "font-medium text-primary",
        className,
      )}
    >
      {children}
    </div>
  );
}

function TimeGridColumnBody({
  children,
  className,
  ...props
}: TimeGridColumnBodyProps) {
  return (
    <div
      {...props}
      className={cn("flex-1 border-r border-secondary pb-2", className)}
    >
      {children}
    </div>
  );
}

function TimeGridEventCard({ event }: TimeGridEventCardProps) {
  const { viewHeight, viewTimeRange } = useContext(TimeGridContext);

  const viewLength = viewTimeRange.endMinutes - viewTimeRange.startMinutes;

  const eventStart = event.time.startMinutes - viewTimeRange.startMinutes;
  const eventEnd = event.time.endMinutes - viewTimeRange.startMinutes;

  const viewScale = viewHeight / viewLength;

  const positionTop = eventStart * viewScale + 1;
  const positionBottom = eventEnd * viewScale - 2;

  const height = positionBottom - positionTop;

  return (
    <div
      className="absolute left-0 right-0 flex flex-col gap-1 rounded-lg border border-l-8 border-green-500 bg-primary p-2 text-sm text-green-500"
      style={{ top: `${positionTop}px`, height: `${height}px` }}
    >
      <h3 className="font-semibold">Organização de Computadores</h3>
      <p>Teórica</p>
      <p>08:00 - 10:00</p>
    </div>
  );
}

function TimeGridEventFrame({ events }: TimeGridEventFrameProps) {
  return (
    <div className="relative min-w-40 flex-1">
      {events.map((event, index) => (
        <TimeGridEventCard key={index} event={event} />
      ))}
    </div>
  );
}

function TimeGridTimeColumn() {
  const { viewTimeTicks } = useContext(TimeGridContext);

  return (
    <TimeGridColumn className="sticky left-0 z-20 w-20 bg-primary">
      <TimeGridColumnHeading />
      <TimeGridColumnBody>
        {viewTimeTicks.slice(1).map((tick, index) => {
          const minutes = tick % MINUTES_PER_HOUR;
          const hours = ((tick - minutes) % MINUTES_PER_DAY) / MINUTES_PER_HOUR;

          const formattedMinutes = String(minutes).padStart(2, "0");
          const formattedHours = String(hours).padStart(2, "0");

          return (
            <div
              key={index}
              className="flex min-h-16 flex-1 items-end justify-end gap-2"
            >
              <div className="translate-y-1/2 text-sm text-tertiary">
                {formattedHours}:{formattedMinutes}
              </div>
              <div className="w-2 border-b border-secondary" />
            </div>
          );
        })}
      </TimeGridColumnBody>
    </TimeGridColumn>
  );
}

function TimeGridTimelineColumn({
  title,
  groups,
}: TimeGridTimelineColumnProps) {
  return (
    <TimeGridColumn style={{ flex: groups.length }}>
      <TimeGridColumnHeading>{title}</TimeGridColumnHeading>
      <TimeGridColumnBody className="flex gap-0.5 px-0.5">
        {groups.map((events, index) => (
          <TimeGridEventFrame key={index} events={events} />
        ))}
      </TimeGridColumnBody>
    </TimeGridColumn>
  );
}

const TimeGridTimeRulers = forwardRef<HTMLDivElement, TimeGridTimeRulersProps>(
  function TimeGridTimeRulers({ className, ...props }, ref) {
    const { viewTimeTicks } = useContext(TimeGridContext);

    return (
      <div
        ref={ref}
        {...props}
        className={cn(
          "absolute bottom-2 left-0 right-0 top-10 -z-10 flex flex-col",
          className,
        )}
      >
        {viewTimeTicks.slice(1).map((tick) => (
          <div key={tick} className="flex-1 border-b border-secondary" />
        ))}
      </div>
    );
  },
);

export function TimeGrid({ timelines, events }: TimeGridProps) {
  const [viewHeight, setViewHeight] = useState(0);

  const viewTimeTicks = useMemo(() => {
    const step = MINUTES_PER_HOUR;
    const ticks: number[] = [];

    const startStep = Math.floor((6 * MINUTES_PER_HOUR) / step);
    const endStep = Math.floor((24 * MINUTES_PER_HOUR) / step);

    for (let i = startStep; i <= endStep; i++) {
      ticks.push(i * step);
    }

    return ticks;
  }, []);

  const viewTimeRange = useMemo(
    () =>
      ({
        startMinutes: Math.min(...viewTimeTicks),
        endMinutes: Math.max(...viewTimeTicks),
      }) as TimeGridRelativeTimeRange,
    [viewTimeTicks],
  );

  const groups = useMemo(() => {
    const groups: Record<string, TimeGridEvent[][]> = Object.fromEntries(
      timelines.map((timeline) => [timeline, [[]]]),
    );

    function doTimeRangesOverlap(
      a: TimeGridRelativeTimeRange,
      b: TimeGridRelativeTimeRange,
    ) {
      return (
        Math.max(a.startMinutes, b.startMinutes) <
        Math.min(a.endMinutes, b.endMinutes)
      );
    }

    function hasConflictingEvent(
      time: TimeGridRelativeTimeRange,
      events: TimeGridEvent[],
    ) {
      for (const event of events) {
        if (doTimeRangesOverlap(time, event.time)) {
          return true;
        }
      }

      return false;
    }

    for (const event of events) {
      let availableGroup = groups[event.timeline]?.find(
        (t) => !hasConflictingEvent(event.time, t),
      );

      if (availableGroup) {
        availableGroup.push(event);
      } else {
        groups[event.timeline]?.push([event]);
      }
    }

    return groups;
  }, [timelines, events]);

  const bodyRef = useRef<HTMLDivElement>(null);

  function refreshViewHeight() {
    setViewHeight(bodyRef.current?.offsetHeight ?? 0);
  }

  useEffect(refreshViewHeight, []);

  return (
    <TimeGridContext.Provider
      value={{ viewHeight, viewTimeTicks, viewTimeRange }}
    >
      <div className="relative flex-1 overflow-auto">
        <div className="relative flex min-w-min">
          <TimeGridTimeColumn />
          {Object.entries(groups).map(([timeline, groups]) => (
            <TimeGridTimelineColumn
              key={timeline}
              title={timeline}
              groups={groups}
            />
          ))}
          <TimeGridTimeRulers
            ref={bodyRef}
            onLoad={refreshViewHeight}
            onResize={refreshViewHeight}
          />
        </div>
      </div>
    </TimeGridContext.Provider>
  );
}
