"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EditSetsDialogProps {
  open: boolean;
  onClose: () => void;
  muscleName: string;
  currentSets: number;
  onSave: (newSets: number) => void;
}

export default function EditSetsDialog({
  open,
  onClose,
  muscleName,
  currentSets,
  onSave,
}: EditSetsDialogProps) {
  const [newSets, setNewSets] = useState<number>(currentSets);

  useEffect(() => {
    if (open) setNewSets(currentSets);
  }, [open, currentSets]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Sets</DialogTitle>
          <DialogDescription>
            Enter the new number of sets for <strong>{muscleName}</strong>.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="sets">Sets</Label>
            <Input
              id="sets"
              type="number"
              min="1"
              value={newSets}
              onChange={(e) => setNewSets(parseInt(e.target.value) || 0)}
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <Button
            type="button"
            variant="default"
            onClick={() => {
              if (newSets > 0) {
                onSave(newSets);
                onClose();
              } else {
                alert("Please enter a valid positive number.");
              }
            }}
          >
            Save
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
