import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ClassSectionProps {
  children?: ReactNode;
  className?: string;
  title: string;
}

function ClassSection({ children, className, title }: ClassSectionProps) {
  return (
    <div className={cn("text-sm", className)}>
      <h5 className="mb-0.5 font-semibold">{title}</h5>
      <div>{children}</div>
    </div>
  );
}

function ClassSchedule() {
  return (
    <table className="max-w-80 text-nowrap">
      <tbody>
        <tr>
          <td>Segunda-feira</td>
          <td className="w-full text-center">16:30 - 18:30</td>
          <td>Prática</td>
        </tr>
      </tbody>
    </table>
  );
}

export function ClassCard() {
  return (
    <div className="rounded-lg border border-primary">
      <div className="flex justify-between items-center p-4 border-b border-primary">
        <h4>Turma A</h4>
        <div className="size-8 rounded-lg bg-tertiary" />
      </div>
      <div className="grid grid-cols-2 gap-4 p-4">
        <ClassSection className="col-span-full" title="Curso">
          Ciência da Computação
        </ClassSection>
        <ClassSection className="col-span-full" title="Estrutura">
          4º semestre
        </ClassSection>
        <ClassSection title="Vagas ofertadas">
          40
        </ClassSection>
        <ClassSection title="Vagas ocupadas">
          12
        </ClassSection>
        <ClassSection className="col-span-full" title="Docentes">
          Steve No Jobs <br />
          Zuker Markberg <br />
        </ClassSection>
        <ClassSection className="col-span-full" title="Horários">
          <ClassSchedule />
        </ClassSection>
      </div>
    </div>
  )  
}