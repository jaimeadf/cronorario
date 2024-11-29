import { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Bookmark } from "react-feather";
import {
  UniversityClass,
  UniversityTimeSlot,
  parseUniversityTime,
} from "@cronorario/core";
import { useUniversity } from "@/app/_contexts/university-context";
import { useUser } from "@/app/_contexts/user-context";

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
      <div className="w-full">{children}</div>
    </div>
  );
}

function ClassSchedule({ schedule }: ClassScheduleProps) {
  return (
    <table className="block max-w-80 overflow-hidden text-nowrap">
      <tbody>
        {schedule.map((slot, index) => {
          const startTime = parseUniversityTime(slot.startTime);
          const endTime = parseUniversityTime(slot.endTime);

          return (
            <tr key={index}>
              <td>{slot.dayOfWeek}</td>
              <td className="w-full px-2 text-center">
                {startTime.hours}:{startTime.minutes} - {endTime.hours}:
                {endTime.minutes}
              </td>
              <td className="text-ellipsis whitespace-nowrap">{slot.type}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export function ClassCard({ classs }: ClassCardProps) {
  const { getCourse, getTeacher, getCurriculum, getCourseVersion } =
    useUniversity();
  const {
    addClassIdToSelection,
    removeClassIdFromSelection,
    isClassIdSelected,
  } = useUser();

  const curriculum = getCurriculum(classs.curriculumId)!;
  const courseVersion = getCourseVersion(curriculum.courseVersionId)!;
  const course = getCourse(courseVersion.courseId)!;
  const teachers = classs.teacherIds.map((teacherId) => getTeacher(teacherId)!);

  const selected = isClassIdSelected(classs.term, classs.id);

  function handleClassSelect() {
    if (selected) {
      removeClassIdFromSelection(classs.term, classs.id);
    } else {
      addClassIdToSelection(classs.term, classs.id);
    }
  }

  return (
    <div className="rounded-lg border border-primary">
      <div className="flex items-center justify-between border-b border-primary p-4">
        <h4 className="text-primary">Turma {classs.code}</h4>
        <button
          className="flex size-10 items-center justify-center rounded-lg hover:bg-primary-hover"
          onClick={handleClassSelect}
        >
          <Bookmark
            className={cn("size-6 text-brand", { "fill-current": selected })}
          />
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
