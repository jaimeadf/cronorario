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
const HOURS_PER_DAY = 24;

interface TimeGridContextProps {
  viewHeight: number;
  viewTimeTicks: number[];
  viewTimeRange: TimeGridTimeRange;
}

interface TimeGridHeadingProps extends HTMLAttributes<HTMLDivElement> {}

interface TimeGridEventCardProps {
  event: TimeGridEvent;
}

interface TimeGridEventColumnProps {
  events: TimeGridEvent[];
}

interface TimeGridProps {
  events: TimeGridEvent[];
}

export enum TimeGridDayOfWeek {
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
}

export interface TimeGridTimeRange {
  startMinutes: number;
  endMinutes: number;
}

export interface TimeGridEvent {
  title: string;
  description: string;
  day: TimeGridDayOfWeek;
  range: TimeGridTimeRange;
}

const TimeGridContext = createContext({} as TimeGridContextProps);

function TimeGridHeading({
  children,
  className,
  ...props
}: TimeGridHeadingProps) {
  return (
    <div
      {...props}
      className={cn(
        "flex flex-1 items-center justify-center font-medium text-primary",
        className,
      )}
    >
      {children}
    </div>
  );
}

function TimeGridEventCard({ event }: TimeGridEventCardProps) {
  const { viewHeight, viewTimeRange } = useContext(TimeGridContext);

  const viewLength = viewTimeRange.endMinutes - viewTimeRange.startMinutes;

  const eventStart = event.range.startMinutes - viewTimeRange.startMinutes;
  const eventEnd = event.range.endMinutes - viewTimeRange.startMinutes;

  const viewScale = viewHeight / viewLength;

  const positionTop = eventStart * viewScale + 1;
  const positionBottom = eventEnd * viewScale - 2;

  const height = positionBottom - positionTop;

  return (
    <div
      className="absolute left-0.5 right-0.5 flex flex-col gap-1 rounded-lg border border-l-8 border-green-500 bg-primary p-2 text-sm text-green-500"
      style={{ top: `${positionTop}px`, height: `${height}px` }}
    >
      <h3 className="font-semibold">Organização de Computadores</h3>
      <p>Teórica</p>
      <p>08:00 - 10:00</p>
    </div>
  );
}

function TimeGridTimeRulers() {
  const { viewTimeTicks } = useContext(TimeGridContext);

  return (
    <div className="absolute bottom-0 left-0 right-0 top-0 -z-10 flex flex-col">
      {viewTimeTicks.slice(1).map((tick) => (
        <div key={tick} className="flex-1 border-b border-secondary" />
      ))}
    </div>
  );
}

function TimeGridTimeColumn() {
  const { viewTimeTicks } = useContext(TimeGridContext);

  return (
    <div className="sticky left-0 z-10 flex w-20 flex-col border-r border-secondary bg-primary">
      {viewTimeTicks.slice(1).map((tick) => {
        const minutes = tick % MINUTES_PER_HOUR;
        const hours = ((tick - minutes) / MINUTES_PER_HOUR) % HOURS_PER_DAY;

        const formattedMinutes = String(minutes).padStart(2, "0");
        const formattedHours = String(hours).padStart(2, "0");

        return (
          <div className="flex min-h-16 flex-1 items-end justify-end gap-2">
            <div className="translate-y-1/2 text-sm text-tertiary">
              {formattedHours}:{formattedMinutes}
            </div>
            <div className="w-2 border-b border-secondary" />
          </div>
        );
      })}
    </div>
  );
}

function TimeGridEventColumn({ events }: TimeGridEventColumnProps) {
  return (
    <div className="relative min-w-40 flex-1 border-r border-secondary">
      {events.map((event) => (
        <TimeGridEventCard event={event} />
      ))}
    </div>
  );
}

export function TimeGrid({ events }: TimeGridProps) {
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
      }) as TimeGridTimeRange,
    [viewTimeTicks],
  );

  const days = useMemo(() => {
    const timelines: Record<TimeGridDayOfWeek, TimeGridEvent[][]> = {
      [TimeGridDayOfWeek.Monday]: [[]],
      [TimeGridDayOfWeek.Tuesday]: [[]],
      [TimeGridDayOfWeek.Wednesday]: [[]],
      [TimeGridDayOfWeek.Thursday]: [[]],
      [TimeGridDayOfWeek.Friday]: [[]],
      [TimeGridDayOfWeek.Saturday]: [[]],
    };

    function doTimeRangesOverlap(a: TimeGridTimeRange, b: TimeGridTimeRange) {
      return (
        Math.max(a.startMinutes, b.startMinutes) <
        Math.min(a.endMinutes, b.endMinutes)
      );
    }

    function hasConflictingEvent(
      time: TimeGridTimeRange,
      events: TimeGridEvent[],
    ) {
      for (const event of events) {
        if (doTimeRangesOverlap(time, event.range)) {
          return true;
        }
      }

      return false;
    }

    for (const event of events) {
      let availableTimeline = timelines[event.day]?.find(
        (t) => !hasConflictingEvent(event.range, t),
      );

      if (availableTimeline) {
        availableTimeline.push(event);
      } else {
        timelines[event.day]?.push([event]);
      }
    }

    return timelines;
  }, [events]);

  const bodyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => refreshBodyDimensions(), []);

  function refreshBodyDimensions() {
    console.log(bodyRef.current);
    setViewHeight(bodyRef?.current?.offsetHeight ?? 0);
  }

  return (
    <TimeGridContext.Provider
      value={{ viewHeight, viewTimeTicks, viewTimeRange }}
    >
      <div className="relative flex-1 overflow-auto">
        <div className="flex min-w-min flex-col">
          <div className="sticky top-0 z-20 flex h-10 border-b border-primary bg-primary">
            <div className="sticky left-0 w-20 bg-primary"></div>
            {Object.entries(days).map(([day, timelines]) => (
              <TimeGridHeading key={day} style={{ flex: timelines.length }}>
                {day}
              </TimeGridHeading>
            ))}
          </div>
          <div
            ref={bodyRef}
            className="relative flex flex-1"
            onResize={refreshBodyDimensions}
          >
            <TimeGridTimeRulers />
            <TimeGridTimeColumn />
            {Object.entries(days).flatMap(([day, timelines]) =>
              timelines.map((events, index) => (
                <TimeGridEventColumn key={`${day}_${index}`} events={events} />
              )),
            )}
          </div>
        </div>
      </div>
    </TimeGridContext.Provider>
  );
}
