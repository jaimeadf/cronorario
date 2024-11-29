import { Trash } from "react-feather";

import { UniversityClass } from "@cronorario/core";

import { useUniversity } from "@/app/_contexts/university-context";
import { useClasses } from "@/app/_contexts/classes-context";
import { useUser } from "@/app/_contexts/user-context";

interface MyClassProps {
  classs: UniversityClass;
}

export function MyClass({ classs }: MyClassProps) {
  const { getSubject } = useUniversity();
  const { removeClassIdFromSelection } = useUser();

  const subject = getSubject(classs.subjectId)!;

  function handleRemoveClick() {
    removeClassIdFromSelection(classs.term, classs.id);
  }

  return (
    <div className="flex w-full items-center gap-2 border-b border-secondary px-2 py-4">
      <div className="flex flex-1 flex-col gap-0.5 text-primary">
        <h2 className="font-medium">{subject.description}</h2>
        <h3 className="text-sm">Turma {classs.code}</h3>
      </div>
      <button
        className="rounded-lg bg-primary text-primary hover:bg-primary-hover"
        onClick={handleRemoveClick}
      >
        <Trash className="size-10 p-2" />
      </button>
    </div>
  );
}

export function MyClasses() {
  const { activeTerm, getClass } = useClasses();
  const { getSelectedClassIds, clearSelectedClassIds } = useUser();

  const selectedClasses = getSelectedClassIds(activeTerm)
    .map((id) => getClass(id))
    .filter(Boolean);

  function handleClearClick() {
    clearSelectedClassIds();
  }

  return (
    <div className="px-2">
      <div className="flex justify-between px-2 py-4">
        <h1>{selectedClasses.length} turma(s) selecionada(s)</h1>
        <button className="font-medium text-brand" onClick={handleClearClick}>
          Limpar
        </button>
      </div>
      <div className="border-t border-secondary">
        {selectedClasses.map((classs) => (
          <MyClass key={classs!.id} classs={classs!} />
        ))}
      </div>
    </div>
  );
}
