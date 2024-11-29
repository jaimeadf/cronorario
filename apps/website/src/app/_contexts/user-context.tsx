import { createContext, useContext, useState } from "react";
import { UniversityTerm } from "@cronorario/core";

interface UserContext {
  addClassIdToSelection(term: UniversityTerm, classId: number): void;
  removeClassIdFromSelection(term: UniversityTerm, classId: number): void;

  isClassIdSelected(term: UniversityTerm, classId: number): boolean;

  getSelectedClassIds(term: UniversityTerm): number[];
  clearSelectedClassIds(): void;
}

export const UserContext = createContext({} as UserContext);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [selectedClassIds, setSelectedClassIds] = useState<
    Map<string, number[]>
  >(
    new Map([
      [
        "2021-1",
        [
          924078, 937326, 924099, 937335, 924094, 937344, 916134, 916120,
          916156, 932386, 916137, 916133, 916117, 916163, 932348, 932393,
          916124, 916141, 932363, 932352, 932356, 932372, 932362,
        ],
      ],
    ]),
  );

  function makeTermKey(term: UniversityTerm) {
    return `${term.year}-${term.period}`;
  }

  function addClassIdToSelection(term: UniversityTerm, classId: number) {
    const key = makeTermKey(term);

    setSelectedClassIds((prev) => {
      const selected = prev.get(key) ?? [];

      if (selected.includes(classId)) {
        return prev;
      }

      return new Map(prev).set(key, [...selected, classId]);
    });
  }

  function removeClassIdFromSelection(term: UniversityTerm, classId: number) {
    const key = makeTermKey(term);

    setSelectedClassIds((prev) => {
      const selected = prev.get(key);

      if (!selected) {
        return prev;
      }

      return new Map(prev).set(
        key,
        selected.filter((id) => id !== classId),
      );
    });
  }

  function isClassIdSelected(term: UniversityTerm, classId: number) {
    const key = makeTermKey(term);
    const selected = selectedClassIds.get(key);

    return selected?.includes(classId) ?? false;
  }

  function getSelectedClassIds(term: UniversityTerm) {
    const key = makeTermKey(term);

    return selectedClassIds.get(key) ?? [];
  }

  function clearSelectedClassIds() {
    setSelectedClassIds(new Map());
  }

  return (
    <UserContext.Provider
      value={{
        addClassIdToSelection,
        removeClassIdFromSelection,
        isClassIdSelected,
        getSelectedClassIds,
        clearSelectedClassIds,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
