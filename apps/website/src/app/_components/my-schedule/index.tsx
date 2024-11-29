import { useUniversity } from "@/app/_contexts/university-context";
import { useClasses } from "@/app/_contexts/classes-context";
import { useUser } from "@/app/_contexts/user-context";

import { TimeGrid, TimeGridEvent } from "./time-grid";
import { parseUniversityTime } from "@cronorario/core";
import { useMemo } from "react";

import colors from "tailwindcss/colors";

const EVENT_COLORS = [
  colors.red,
  colors.orange,
  // colors.amber,
  colors.yellow,
  // colors.lime,
  colors.green,
  colors.emerald,
  colors.teal,
  colors.cyan,
  colors.sky,
  colors.blue,
  colors.indigo,
  colors.violet,
  colors.purple,
  // colors.fuchsia,
  colors.pink,
];

export function MySchedule() {
  const { getSubject } = useUniversity();
  const { activeTerm, getClass } = useClasses();
  const { getSelectedClassIds } = useUser();

  const events = useMemo(() => {
    const classes = getSelectedClassIds(activeTerm)
      .map((id) => getClass(id)!)
      .filter(Boolean);

    const events = classes.map((classs) => {
      const subject = getSubject(classs.subjectId)!;

      return classs.schedule.map((slot) => {
        const startTime = parseUniversityTime(slot.startTime);
        const endTime = parseUniversityTime(slot.endTime);

        const event: TimeGridEvent = {
          title: subject.description,
          description: slot.type,
          timeline: slot.dayOfWeek,
          time: {
            startMinutes: startTime.hours * 60 + startTime.minutes,
            endMinutes: endTime.hours * 60 + endTime.minutes,
          },
          textColor: EVENT_COLORS[classs.id % EVENT_COLORS.length]["400"],
          backgroundColor:
            colors.white || EVENT_COLORS[classs.id % EVENT_COLORS.length]["50"],
        };

        return event;
      });
    });

    return events.flat();
  }, [activeTerm, getClass, getSubject, getSelectedClassIds]);

  return (
    <TimeGrid
      timelines={[
        "Segunda-feira",
        "Terça-feira",
        "Quarta-feira",
        "Quinta-feira",
        "Sexta-feira",
        "Sábado",
      ]}
      events={events}
    />
  );
}
