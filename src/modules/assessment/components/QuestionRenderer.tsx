"use client";

import { AssessmentQuestion } from "@/types/assessment";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface QuestionRendererProps {
  question: AssessmentQuestion;
  currentValue?: unknown;
  onChange: (val: unknown) => void;
}

export function QuestionRenderer({ question, currentValue, onChange }: QuestionRendererProps) {
  // Common renderer for SCALE and SINGLE_CHOICE
  if (question.type === "SCALE" || question.type === "SINGLE_CHOICE") {
    const valueString = currentValue !== undefined && currentValue !== null ? String(currentValue) : undefined;
    
    return (
      <RadioGroup
        value={valueString}
        onValueChange={(val) => {
          // If option values are numbers, parse them back. 
          // Future-proofing: checking the type of the first option's value.
          const isNumeric = question.options?.length && typeof question.options[0].value === "number";
          onChange(isNumeric ? parseInt(val, 10) : val);
        }}
        className="flex flex-col gap-3 mt-8"
      >
        {question.options?.map((opt) => {
          const optValueStr = String(opt.value);
          const id = `q-${question.id}-opt-${optValueStr}`;
          const isSelected = valueString === optValueStr;
          
          return (
            <Label
              key={optValueStr}
              htmlFor={id}
              className={`flex items-center space-x-4 rounded-xl border p-5 cursor-pointer transition-all duration-200 ${
                isSelected 
                  ? "bg-zinc-900 border-zinc-900 text-white dark:bg-white dark:border-white dark:text-zinc-900 shadow-md scale-[1.01]" 
                  : "bg-white border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50 dark:bg-zinc-950 dark:border-zinc-800 dark:hover:border-zinc-600 text-zinc-900 dark:text-zinc-100"
              }`}
            >
              <RadioGroupItem 
                value={optValueStr} 
                id={id} 
                className={isSelected ? "border-white text-white dark:border-zinc-900 dark:text-zinc-900" : ""}
              />
              <span className="flex-1 text-base sm:text-lg font-medium">
                {opt.label}
              </span>
            </Label>
          );
        })}
      </RadioGroup>
    );
  }

  // Fallback for unsupported types
  return (
    <div className="p-6 mt-8 border border-amber-200 rounded-xl bg-amber-50 text-amber-900 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-200">
      <p className="font-semibold">Unsupported question type: {question.type}</p>
      <p className="text-sm mt-1 opacity-80">Please contact support.</p>
    </div>
  );
}
