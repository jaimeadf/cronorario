import { createContext, ReactNode, useContext } from "react";

import classData from "./classes.json";

export interface CourseClass {
  id: number;
  code: string;
  idealPeriod: number;
  oferredSeats: number;
  occupiedSeats: number;
  curriculum: {
    id: number;
    number: string;
    status: string;
  };
  subject: {
    id: number;
    code: string;
    description: string;
    credits: number;
    workload: number;
  };
  course: {
    id: number;
    code: string;
    name: string;
    campusId: number;
  };
  teachers: Array<{
    id: number;
    name: string;
  }>;
  schedule: Array<{
    id: number;
    startTime: string;
    endTime: string;
    type: string;
    weekDay: string;
  }>;
}

interface ClassesContextProps {
  classes: CourseClass[];
}

interface ClassesProviderProps {
  children?: ReactNode;
}

const ClassesContext = createContext({} as ClassesContextProps);

export function ClassesProvider({ children }: ClassesProviderProps) {
  return (
    <ClassesContext.Provider value={{ classes: classData as CourseClass[] }}>
      {children}
    </ClassesContext.Provider>
  );
}

export function useClasses() {
  return useContext(ClassesContext);
}
