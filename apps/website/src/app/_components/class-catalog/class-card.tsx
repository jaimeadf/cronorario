import { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { CourseClass } from "../../_contexts/classes-context";

interface ClassScheduleProps {
  information: CourseClass;
}

interface ClassCardProps {
  information: CourseClass;
}

interface ClassSectionProps {
  children?: ReactNode;
  className?: string;
  title: string;
}

function ClassSection({ children, className, title }: ClassSectionProps) {
  return (
    <div className={cn("text-sm text-primary", className)}>
      <h5 className="mb-0.5 font-semibold">{title}</h5>
      <div>{children}</div>
    </div>
  );
}

function ClassSchedule({ information }: ClassScheduleProps) {
  return (
    <table className="max-w-80 text-nowrap">
      <tbody>
        {information.schedule.map((s) => (
          <tr key={s.id}>
            <td>{s.weekDay}</td>
            <td className="w-full text-center">
              {s.startTime} - {s.endTime}
            </td>
            <td>{s.type}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function ClassCard({ information }: ClassCardProps) {
  return (
    <div className="rounded-lg border border-primary">
      <div className="flex items-center justify-between border-b border-primary p-4">
        <h4 className="text-primary">Turma {information.code}</h4>
        <div className="size-8 rounded-lg bg-tertiary" />
      </div>
      <div className="grid grid-cols-2 gap-4 p-4">
        <ClassSection className="col-span-full" title="Curso">
          {information.course.name}
        </ClassSection>
        <ClassSection className="col-span-full" title="Estrutura">
          {information.idealPeriod}º semestre
        </ClassSection>
        <ClassSection title="Vagas ofertadas">
          {information.oferredSeats}
        </ClassSection>
        <ClassSection title="Vagas ocupadas">
          {information.occupiedSeats}
        </ClassSection>
        <ClassSection className="col-span-full" title="Docentes">
          <ul>
            {information.teachers.map((teacher) => (
              <li key={teacher.id}>{teacher.name}</li>
            ))}
          </ul>
        </ClassSection>
        <ClassSection className="col-span-full" title="Horários">
          <ClassSchedule information={information} />
        </ClassSection>
      </div>
    </div>
  );
}
