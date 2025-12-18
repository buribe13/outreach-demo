"use client";

/**
 * OUTREACH WINDOW PLANNER - Add Signal Dialog
 *
 * Allows organizers to add custom planning items.
 * These are stored locally (no server, no user tracking).
 *
 * Examples of custom signals:
 * - Outreach team shifts
 * - Partner organization availability
 * - Internal events or meetings
 * - Resource distribution schedules
 */

import React, { useState } from "react";
import { format, addHours } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import type {
  Signal,
  SignalType,
  ImpactLevel,
  ConfidenceLevel,
} from "@/lib/types";

interface AddSignalDialogProps {
  onAdd: (signal: Signal) => void;
}

// Custom signal type options (subset appropriate for org use)
const signalTypeOptions: { value: SignalType; label: string }[] = [
  { value: "custom", label: "Custom Item" },
  { value: "publicEvent", label: "Event / Gathering" },
  { value: "shelterHours", label: "Service Hours" },
  { value: "transitDisruption", label: "Transit Note" },
  { value: "serviceBottleneck", label: "Service Bottleneck" },
];

const impactOptions: { value: ImpactLevel; label: string }[] = [
  { value: "low", label: "Low - Minor impact on outreach" },
  { value: "medium", label: "Medium - Some disruption expected" },
  { value: "high", label: "High - Significant disruption" },
];

export function AddSignalDialog({ onAdd }: AddSignalDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [signalType, setSignalType] = useState<SignalType>("custom");
  const [impactLevel, setImpactLevel] = useState<ImpactLevel>("low");
  const [startDate, setStartDate] = useState(
    format(new Date(), "yyyy-MM-dd'T'HH:mm")
  );
  const [endDate, setEndDate] = useState(
    format(addHours(new Date(), 2), "yyyy-MM-dd'T'HH:mm")
  );
  const [notes, setNotes] = useState("");

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setSignalType("custom");
    setImpactLevel("low");
    setStartDate(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
    setEndDate(format(addHours(new Date(), 2), "yyyy-MM-dd'T'HH:mm"));
    setNotes("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      alert("End time must be after start time.");
      return;
    }

    const signal: Signal = {
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      signalType,
      title: title.trim(),
      description: description.trim() || title.trim(),
      timeRange: {
        start: start.toISOString(),
        end: end.toISOString(),
      },
      source: {
        label: "Custom (Org-added)",
        kind: "partnerProvided",
        lastUpdated: new Date().toISOString(),
      },
      impactLevel,
      confidenceLevel: "high" as ConfidenceLevel, // Custom items are high confidence
      interpretationNotes: notes.trim() || "Custom item added by organization.",
      areaContext: "Koreatown Area",
      isCustom: true,
    };

    onAdd(signal);
    resetForm();
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset form when dialog closes
      resetForm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Planning Item</DialogTitle>
          <DialogDescription>
            Add a custom signal to your planning timeline. This is stored
            locally on your device.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Team A Morning Shift"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this planning item..."
              rows={2}
            />
          </div>

          {/* Type & Impact Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={signalType}
                onValueChange={(v) => setSignalType(v as SignalType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {signalTypeOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Impact Level</Label>
              <Select
                value={impactLevel}
                onValueChange={(v) => setImpactLevel(v as ImpactLevel)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {impactOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date/Time Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Time</Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Time</Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Coordinator Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional context for team members..."
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim()}>
              Add to Timeline
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
