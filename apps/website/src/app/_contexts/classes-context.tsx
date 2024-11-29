import {
  UniversityTerm,
  UniversityClass,
  UniversityClassFrame,
  getFramePath,
} from "@cronorario/core";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useUniversity } from "./university-context";

import { RESOURCE_BASE_URL } from "@/lib/environment";

interface ClassesContextProps {
  activeTerm: UniversityTerm;
  classes: Map<number, UniversityClass>;

  isClassesLoading: boolean;

  setActiveTerm(term: UniversityTerm): void;

  getClass(id: number): UniversityClass | undefined;
}

interface ClassesProviderProps {
  children?: ReactNode;
}

const ClassesContext = createContext({} as ClassesContextProps);

export function ClassesProvider({ children }: ClassesProviderProps) {
  const { terms } = useUniversity();

  const [activeTerm, setActiveTerm] = useState<UniversityTerm>({
    year: 0,
    period: 0,
  });
  const [classes, setClasses] = useState<Map<number, UniversityClass>>(
    new Map(),
  );
  const [isClassesLoading, setIsClassesLoading] = useState(false);

  function getClass(classId: number) {
    return classes.get(classId);
  }

  useEffect(() => {
    if (activeTerm.year === 0 || activeTerm.period === 0) {
      return;
    }

    const controller = new AbortController();

    setIsClassesLoading(true);

    fetch(`${RESOURCE_BASE_URL}/${getFramePath(activeTerm)}`, {
      signal: controller.signal,
    })
      .then((response) => response.json())
      .then((data) => {
        const frame: UniversityClassFrame = data;
        const classes = new Map<number, UniversityClass>(
          frame.classes.map((c) => [c.id, c]),
        );

        setClasses(classes);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsClassesLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [activeTerm]);

  useEffect(() => {
    if (terms.length > 0) {
      setActiveTerm(terms[0]);
    }
  }, [terms]);

  return (
    <ClassesContext.Provider
      value={{ activeTerm, classes, isClassesLoading, setActiveTerm, getClass }}
    >
      {children}
    </ClassesContext.Provider>
  );
}

export function useClasses() {
  return useContext(ClassesContext);
}
