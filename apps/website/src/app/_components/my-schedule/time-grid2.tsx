import { createContext, HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface TimeGridTimeRange {
  startSeconds: number;
  endSeconds: number;
}

export interface TimeGridAppointment {
  title: string;
  description: string;
  time: TimeGridTimeRange;
}

interface TimeGridContextProps {}

interface TimeGridColumnProps extends HTMLAttributes<HTMLDivElement> {}
interface TimeGridHeadingProps extends HTMLAttributes<HTMLDivElement> {}
interface TimeGridBodyProps extends HTMLAttributes<HTMLDivElement> {}

interface TimeGridAppointmentGroupProps {
  children?: ReactNode;
}

const TimeGridContext = createContext({} as TimeGridContextProps);

function TimeGridColumn({
  children,
  className,
  ...props
}: TimeGridColumnProps) {
  return (
    <div {...props} className={cn("flex flex-col bg-primary", className)}>
      {children}
    </div>
  );
}

function TimeGridHeading({
  children,
  className,
  ...props
}: TimeGridHeadingProps) {
  return (
    <div
      {...props}
      className={cn(
        "flex h-14 w-full items-center justify-center",
        "border-b border-primary",
        "font-medium uppercase text-primary",
        className,
      )}
    >
      {children}
    </div>
  );
}

function TimeGridBody({ children, className, ...props }: TimeGridBodyProps) {
  return (
    <div
      {...props}
      className={cn("flex-1 border-r border-secondary pb-4", className)}
    >
      {children}
    </div>
  );
}

function TimeGridAppointmentGroup({ children }: TimeGridAppointmentGroupProps) {
  return <div className="relative min-w-40 flex-1">{children}</div>;
}

function TimeGridAppointmentCard() {
  return (
    <div className="absolute flex w-full flex-col gap-1 rounded-lg border border-l-8 border-green-500 p-2 text-sm text-green-500">
      <h3 className="font-semibold">Organização de Computadores</h3>
      <p>Teórica</p>
      <p>08:00 - 10:00</p>
    </div>
  );
}

function TimeGridTimeLine() {
  return <div className="min-h-16 flex-1 border-b border-secondary" />;
}

function TimeGridTimeLines() {
  return (
    <div className="absolute inset-0 z-10 flex h-full w-full flex-col pb-4 pt-14">
      <TimeGridTimeLine />
      <TimeGridTimeLine />
      <TimeGridTimeLine />
      <TimeGridTimeLine />
      <TimeGridTimeLine />
    </div>
  );
}

function TimeGridTimeMark() {
  return (
    <div className="flex min-h-16 flex-1 items-end justify-end gap-1">
      <div className="translate-y-1/2 text-sm text-tertiary">07:00</div>
      <div className="w-2 border-b border-secondary"></div>
    </div>
  );
}

function TimeGridTimeMarks() {
  return (
    <TimeGridColumn className="w-20">
      <TimeGridHeading />
      <TimeGridBody className="flex flex-col">
        <TimeGridTimeMark />
        <TimeGridTimeMark />
        <TimeGridTimeMark />
        <TimeGridTimeMark />
        <TimeGridTimeMark />
      </TimeGridBody>
    </TimeGridColumn>
  );
}

function TimeGridDay() {
  return (
    <TimeGridColumn className="flex-1">
      <TimeGridHeading>SEG</TimeGridHeading>
      <TimeGridBody className="flex gap-[0.0625rem] p-[0.0625rem]">
        <TimeGridAppointmentGroup>
          <TimeGridAppointmentCard />
        </TimeGridAppointmentGroup>
      </TimeGridBody>
    </TimeGridColumn>
  );
}

export function TimeGrid() {
  return (
    <div className="flex flex-1 overflow-y-auto">
      <TimeGridTimeMarks />
      <div className="relative flex flex-1 overflow-x-auto">
        <TimeGridTimeLines />
        <TimeGridDay />
        <TimeGridDay />
        <TimeGridDay />
        <TimeGridDay />
        <TimeGridDay />
        <TimeGridDay />
      </div>
    </div>
  );
}
