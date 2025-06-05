"use client";

import { useState, useRef, useEffect } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { PlusCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const mockSymptoms = [
  "Headache", "Fever", "Cough", "Sore Throat", "Runny Nose", "Fatigue",
  "Nausea", "Vomiting", "Diarrhea", "Chest Pain", "Shortness of Breath",
  "Dizziness", "Abdominal Pain", "Back Pain", "Joint Pain", "Muscle Pain",
  "Rash", "Itching", "Swelling", "Blurred Vision", "Earache", "Loss of Appetite",
  "Weight Loss", "High Blood Pressure", "Diabetes", "Asthma", "Depression",
  "Anxiety", "Insomnia", "Hypertension", "High Cholesterol", "Heart Disease",
  "Arthritis", "Allergies", "Eczema", "Ibuprofen", "Acetaminophen", "Aspirin",
  "Lisinopril", "Atorvastatin", "Levothyroxine", "Metformin", "Simvastatin",
  "Omeprazole", "Amlodipine", "Metoprolol", "Albuterol", "Gabapentin",
  "Hydrochlorothiazide","fatigue", "weight_loss", "restlessness", "lethargy","Diclofenac"
];

interface SymptomSearchProps {
  onSymptomSelect: (symptom: string) => void;
  placeholder?: string;
}

export default function SymptomSearch({
  onSymptomSelect,
  placeholder = "Search symptoms..."
}: SymptomSearchProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredSymptoms = search
    ? mockSymptoms.filter(symptom =>
        symptom.toLowerCase().includes(search.toLowerCase())
      )
    : mockSymptoms;

  const handleSelect = (symptom: string) => {
    onSymptomSelect(symptom);
    setSearch(""); // Clear search after selecting
    setOpen(false); // Close the list
    if (inputRef.current) {
      inputRef.current.blur(); // Blur input after selection
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && search.trim()) {
      e.preventDefault();
      handleSelect(search.trim());
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <Command className="rounded-lg border mt-1 overflow-visible">
        <CommandInput
          ref={inputRef}
          placeholder={placeholder}
          value={search}
          onValueChange={(value) => {
            setSearch(value);
            setOpen(true); // Open dropdown when typing
          }}
          onKeyDown={handleInputKeyDown}
          onFocus={() => setOpen(true)}
          className="border-none focus:ring-0"
        />
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              className="absolute w-full z-10 top-12 left-0 bg-popover border border-border rounded-md shadow-md"
            >
              <CommandList>
                <CommandEmpty>
                  Press Enter to add "{search}"
                </CommandEmpty>
                <CommandGroup heading="Suggestions">
                  {filteredSymptoms.map((symptom) => (
                    <CommandItem
                      key={symptom}
                      value={symptom}
                      onSelect={() => handleSelect(symptom)}
                      className="flex items-center cursor-pointer"
                    >
                      <PlusCircle className="mr-2 h-4 w-4 text-primary" />
                      {symptom}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </motion.div>
          )}
        </AnimatePresence>
      </Command>
    </div>
  );
}