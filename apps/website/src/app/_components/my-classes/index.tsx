import { Trash } from "react-feather";

export function SelectedClass() {
  return (
    <div className="flex items-center gap-2 w-full px-2 py-4 border-b border-secondary">
      <div className="flex-1 flex flex-col gap-0.5 text-primary">
        <h2 className="font-medium">Cálculo &quot;A&quot;</h2>
        <h3 className="text-sm">Turma CC</h3>
      </div>
      <button className="rounded-lg text-primary bg-primary hover:bg-primary-hover">
        <Trash className="size-10 p-2" />
      </button>
    </div>
  );
}

export function MyClasses() {
  return (
    <div className="px-2">
      <div className="flex justify-between px-2 py-4">
        <h1>8 turmas selecionadas</h1>
        <button className="text-brand font-medium">Limpar</button>
      </div>
      <div className="border-t border-secondary">
        <SelectedClass />
        <SelectedClass />
        <SelectedClass />
      </div>
    </div>
  );
}