import { TimeGrid } from "./time-grid";

export function MySchedule() {
  return (
    <TimeGrid
      timelines={["SEG", "TER", "QUA", "QUI", "SEX", "SAB"]}
      events={[
        {
          title: "Organização de Computadores",
          description: "Prática",
          timeline: "SEG",
          time: {
            startMinutes: 600,
            endMinutes: 720,
          },
        },
        {
          title: "Organização de Computadores",
          description: "Prática",
          timeline: "SEG",
          time: {
            startMinutes: 600,
            endMinutes: 720,
          },
        },
        {
          title: "Organização de Computadores",
          description: "Prática",
          timeline: "TER",
          time: {
            startMinutes: 630,
            endMinutes: 750,
          },
        },
      ]}
    />
  );
}
