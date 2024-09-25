
import { Toolbar } from "./toolbar";
import { ClassAccordion } from "./class-accordion";

export function ClassCatalog() {
  return (
    <div>
      <Toolbar /> 
      <div className="p-2">
        <div className="w-full border-t border-secondary">
          <ClassAccordion title="Cálculo A" subtitle="MTM1019 • 60h • 3 turmas" />
          <ClassAccordion title="Cálculo A" subtitle="MTM1019 • 60h • 3 turmas" />
          <ClassAccordion title="Cálculo A" subtitle="MTM1019 • 60h • 3 turmas" />
        </div>
      </div>
    </div>
  )
}