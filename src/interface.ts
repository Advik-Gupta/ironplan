export interface MuscleEntry {
  sets: number;
}

export interface DaySplit {
  muscleGroups: string[];
  muscles: Record<string, MuscleEntry>;
}

export interface Split {
  [key: string]: DaySplit;
}
