import { Toolbar } from "./toolbar";
import { ClassList } from "./class-list";

export function ClassCatalog() {
  return (
    <div>
      <Toolbar />
      <div className="p-2">
        <div className="w-full border-t border-secondary">
          <ClassList />
        </div>
      </div>
    </div>
  );
}
