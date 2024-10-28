import { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Bookmark } from "react-feather";
import { UniversityClass, UniversityTimeSlot } from "@cronorario/core";
import { useClasses } from "@/app/_contexts/classes-context";

interface ClassScheduleProps {
  schedule: UniversityTimeSlot[];
}

interface ClassCardProps {
  classs: UniversityClass;
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

function ClassSchedule({ schedule }: ClassScheduleProps) {
  return (
    <table className="max-w-80 text-nowrap">
      <tbody>
        {schedule.map((slot, index) => (
          <tr key={index}>
            <td>{slot.dayOfWeek}</td>
            <td className="w-full text-center">
              {slot.startTime} - {slot.endTime}
            </td>
            <td>{slot.type}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function ClassCard({ classs }: ClassCardProps) {
  const { getCourse, getTeacher, getCurriculum, getCourseVersion } = useClasses();

  const curriculum = getCurriculum(classs.curriculumId)!;
  const courseVersion = getCourseVersion(curriculum.courseVersionId)!;
  const course = getCourse(courseVersion.courseId)!;
  const teachers = classs.teacherIds.map((teacherId) => getTeacher(teacherId)!);

  return (
    <div className="rounded-lg border border-primary">
      <div className="flex items-center justify-between border-b border-primary p-4">
        <h4 className="text-primary">Turma {classs.code}</h4>
        <button className="flex size-10 items-center justify-center rounded-lg hover:bg-primary-hover">
          <Bookmark className="size-6 text-brand" fill="none" />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4 p-4">
        <ClassSection className="col-span-full" title="Curso">
          {course.name}
        </ClassSection>
        <ClassSection className="col-span-full" title="Estrutura">
          {curriculum.idealPeriod}º semestre
        </ClassSection>
        <ClassSection title="Vagas ofertadas">
          {classs.offeredSeats}
        </ClassSection>
        <ClassSection title="Vagas ocupadas">
          {classs.occupiedSeats}
        </ClassSection>
        <ClassSection className="col-span-full" title="Docentes">
          <ul>
            {teachers.map((teacher) => (
              <li key={teacher.id}>{teacher.name}</li>
            ))}
          </ul>
        </ClassSection>
        <ClassSection className="col-span-full" title="Horários">
          <ClassSchedule schedule={classs.schedule} />
        </ClassSection>
      </div>
    </div>
  );
}
