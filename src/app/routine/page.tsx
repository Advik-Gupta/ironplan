"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Slider } from "@/components/ui/slider";
import PieChart from "@/components/PieChart";
import EditSetsDialog from "@/components/EditSetsDialog";

import { muscles } from "@/utils/contants";
import { MuscleEntry, DaySplit, Split } from "@/interface";

const groupedMuscles = muscles.reduce(
  (acc: Record<string, typeof muscles>, muscle) => {
    if (!acc[muscle.group]) acc[muscle.group] = [];
    acc[muscle.group].push(muscle);
    return acc;
  },
  {}
);

export default function RoutinePage() {
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
  const [day, setDay] = useState<string | null>(null);
  const [sets, setSets] = useState<number>(0);
  const [split, setSplit] = useState<Split>({});
  const [selectedDayForDetails, setSelectedDayForDetails] = useState<
    string | null
  >(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [muscleToEdit, setMuscleToEdit] = useState<string | null>(null);

  const handleAddToRoutine = () => {
    if (!selectedMuscle || !day || sets <= 0) return;

    // Find muscle group for selected muscle
    const muscleObj = muscles.find((m) => m.name === selectedMuscle);
    if (!muscleObj) return;

    const muscleGroup = muscleObj.group;

    setSplit((prev) => {
      const newSplit = { ...(prev || {}) };

      // Initialize day if it doesn't exist
      if (!newSplit[day]) {
        newSplit[day] = {
          muscleGroups: [],
          muscles: {},
        };
      }

      // Add muscle group if not already present
      if (!newSplit[day].muscleGroups.includes(muscleGroup)) {
        newSplit[day].muscleGroups.push(muscleGroup);
      }

      // Add or update the muscle with set count
      newSplit[day].muscles[selectedMuscle] = {
        sets,
      };

      return newSplit;
    });

    setSelectedDayForDetails(day);
    // Optionally reset selections
    setSelectedMuscle(null);
    setDay(null);
    setSets(0);
  };

  const handleRemoveExercise = (muscleName: string) => {
    if (!selectedDayForDetails) return;

    setSplit((prev) => {
      const newSplit = { ...prev };
      const dayData = newSplit[selectedDayForDetails];

      if (!dayData) return prev;

      // Delete the muscle
      delete dayData.muscles[muscleName];

      // Remove muscle group if no muscles of that group remain
      const remainingMuscleGroups = new Set(
        Object.keys(dayData.muscles).map(
          (muscle) => muscles.find((m) => m.name === muscle)?.group
        )
      );

      dayData.muscleGroups = Array.from(remainingMuscleGroups).filter(
        Boolean
      ) as string[];

      // If no muscles left, remove the day completely
      if (Object.keys(dayData.muscles).length === 0) {
        delete newSplit[selectedDayForDetails];
        setSelectedDayForDetails(null); // close the details view
      }

      return newSplit;
    });
  };

  const handleEditExercise = (muscleName: string) => {
    setMuscleToEdit(muscleName);
    setEditDialogOpen(true);
  };

  const transformDataForPieChart = (weeklyData: Split) => {
    const groupTotals: Record<string, number> = {};

    for (const day of Object.values(weeklyData)) {
      const { muscleGroups, muscles } = day;

      if (!muscleGroups || !muscles) continue;

      let totalSets = 0;
      for (const muscle of Object.values(muscles)) {
        totalSets += muscle.sets;
      }

      muscleGroups.forEach((group) => {
        groupTotals[group] = (groupTotals[group] || 0) + totalSets;
      });
    }

    return Object.entries(groupTotals).map(([group, sets]) => ({
      group,
      sets,
    }));
  };

  return (
    <div className="p-6">
      {muscleToEdit && selectedDayForDetails && (
        <EditSetsDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          muscleName={muscleToEdit}
          currentSets={
            split[selectedDayForDetails]?.muscles[muscleToEdit]?.sets ?? 0
          }
          onSave={(newSets) => {
            setSplit((prev) => {
              const newSplit = { ...prev };
              const dayData = newSplit[selectedDayForDetails];

              if (dayData && dayData.muscles[muscleToEdit]) {
                dayData.muscles[muscleToEdit].sets = newSets;
              }

              return newSplit;
            });
          }}
        />
      )}
      <div className="splits">
        <h1 className="text-3xl font-bold">Your Splits</h1>
        <p className="mt-2 text-gray-600">
          Here you can see all the splits you have made.
        </p>
      </div>
      <h1 className="text-3xl font-bold">Create a new split</h1>
      <p className="mt-2 text-gray-600">
        Here you can create your own split and connect them to workouts to
        formulate frequency and volume for each muscle group perfectly.
      </p>
      <div className="muscleGrups mt-5 flex gap-x-4 w-full">
        <Card className="w-1/3">
          <CardHeader>
            <CardTitle>Select muscles</CardTitle>
            <CardDescription>
              Select the muscles you want to train in your routine and then see
              the frequency and sets you currently have planned in your routine
              for those muscle groups.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="w-full" variant="outline">
                  {selectedMuscle ? selectedMuscle : "Select muscles"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-100" align="start">
                <DropdownMenuLabel>Muscle Groups</DropdownMenuLabel>
                <DropdownMenuGroup>
                  {Object.entries(groupedMuscles).map(([group, muscles]) => (
                    <DropdownMenuSub key={group}>
                      <DropdownMenuSubTrigger>{group}</DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          {muscles.map((muscle) => (
                            <DropdownMenuItem
                              onSelect={() => setSelectedMuscle(muscle.name)}
                              key={muscle.name}
                            >
                              {muscle.name}
                              {muscle.commonName && ` (${muscle.commonName})`}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardContent>
        </Card>
        {selectedMuscle ? (
          <Card className="w-2/3">
            <CardHeader>
              <CardTitle>
                {selectedMuscle ? selectedMuscle : "Select muscles"}
              </CardTitle>
              <CardDescription>
                Select the day you want to train the muscle on and the number of
                sets you want to perform for that muscle.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="w-full" variant="outline">
                    {day ? day : "Select Day"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onSelect={() => setDay("Monday")}
                    key={"Monday"}
                  >
                    Monday
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => setDay("Tuesday")}
                    key={"Tuesday"}
                  >
                    Tuesday
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => setDay("Wednesday")}
                    key={"Wednesday"}
                  >
                    Wednesday
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => setDay("Thursday")}
                    key={"Thursday"}
                  >
                    Thursday
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => setDay("Friday")}
                    key={"Friday"}
                  >
                    Friday
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => setDay("Saturday")}
                    key={"Saturday"}
                  >
                    Saturday
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => setDay("Sunday")}
                    key={"Sunday"}
                  >
                    Sunday
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {day && (
                <>
                  <div className="slider mt-8">
                    <Slider
                      defaultValue={[0]}
                      max={30}
                      step={1}
                      onValueChange={(value) => setSets(value[0])}
                    />
                  </div>
                  <p className="mt-3">
                    You want to perform <strong>{sets}</strong> number of sets
                    for this muscle on this day
                  </p>
                  <Button onClick={handleAddToRoutine} className=" mt-5">
                    Add to routine
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        ) : (
          <p>Please select a muscle first</p>
        )}
      </div>
      <div className="routine mt-5">
        <h3 className="text-lg font-semibold">
          Total number of days working out: {Object.keys(split).length || 0}
        </h3>
        <h1 className="text-2xl font-bold mt-2">Split: </h1>
        <div className="mt-2 flex gap-x-6">
          <div className="w-1/2">
            <Table>
              <TableCaption>Your Weekly Split Overview</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Day</TableHead>
                  <TableHead>Muscle Groups</TableHead>
                  <TableHead className="text-center">Muscles</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(split).map(([day, data]) => (
                  <TableRow key={day}>
                    <TableCell className="font-medium">{day}</TableCell>
                    <TableCell>
                      {data.muscleGroups.map((group, index) => (
                        <span
                          key={index}
                          className="inline-block mr-2 mb-1 bg-gray-100 px-2 py-1 rounded text-sm"
                        >
                          {group}
                        </span>
                      ))}
                    </TableCell>
                    <TableCell className="text-center">
                      {Object.keys(data.muscles).length}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedDayForDetails(day)}
                      >
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="w-1/2">
            {selectedDayForDetails && (
              <div>
                <h2 className="text-xl font-bold mb-2">
                  Muscles on {selectedDayForDetails}
                </h2>
                <Table>
                  <TableCaption>Muscles and Sets</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Muscle</TableHead>
                      <TableHead className="text-right">Sets</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(split[selectedDayForDetails].muscles).map(
                      ([muscle, { sets }]) => (
                        <TableRow key={muscle}>
                          <TableCell>{muscle}</TableCell>
                          <TableCell className="text-right">{sets}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditExercise(muscle)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleRemoveExercise(muscle)}
                            >
                              Remove
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="distribution">
        <h1 className="text-2xl font-bold mt-2">Workout Distribution</h1>

        <PieChart split={split} />
      </div>
      <div className="w-full mt-5 flex justify-center">
        <Button onClick={() => console.log(split)}>Save Split +</Button>
      </div>
    </div>
  );
}
