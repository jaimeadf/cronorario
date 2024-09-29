import { Trash } from "react-feather";

export function MyClass() {
  return (
    <div className="flex w-full items-center gap-2 border-b border-secondary px-2 py-4">
      <div className="flex flex-1 flex-col gap-0.5 text-primary">
        <h2 className="font-medium">Cálculo &quot;A&quot;</h2>
        <h3 className="text-sm">Turma CC</h3>
      </div>
      <button className="rounded-lg bg-primary text-primary hover:bg-primary-hover">
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
        <button className="font-medium text-brand">Limpar</button>
      </div>
      <div className="border-t border-secondary">
        <MyClass />
        <MyClass />
        <MyClass />
      </div>
    </div>
  );
}
