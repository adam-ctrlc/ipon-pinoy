"use client";
import { useId, SelectHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string;
  options?: SelectOption[];
  placeholder?: string;
  containerClassName?: string;
  selectClassName?: string;
  labelClassName?: string;
  wrapperClassName?: string;
  size?: "md" | "lg";
  icon?: string;
}

export default function Select({
  label,
  options = [],
  placeholder = "Select an option",
  containerClassName = "",
  selectClassName = "",
  labelClassName = "",
  wrapperClassName = "",
  size = "md",
  icon,
  id,
  value,
  onChange,
  required,
  disabled,
  ...props
}: SelectProps) {
  const isLarge = size === "lg";
  const generatedId = useId();
  const selectId = id || generatedId;

  return (
    <div className={cn("flex flex-col gap-2", containerClassName)}>
      {label && (
        <label
          htmlFor={selectId}
          className={cn("text-slate-300 text-xs font-bold uppercase tracking-wider", labelClassName)}
        >
          {label}
        </label>
      )}
      <div className={cn("relative flex items-center group", wrapperClassName)}>
        {icon && (
          <div
            className={cn(
              "absolute left-0 top-0 bottom-0 flex items-center justify-center bg-[#1c1917] border border-r-0 border-white/10 rounded-l-xl text-slate-500 select-none group-focus-within:border-primary group-focus-within:text-primary transition-colors pointer-events-none",
              isLarge ? "w-16" : "w-12"
            )}
          >
            <span className="material-symbols-outlined text-xl">{icon}</span>
          </div>
        )}
        <select
          id={selectId}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={cn(
            "w-full bg-[#1c1917] border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium outline-none transition-all appearance-none cursor-pointer",
            isLarge ? "h-20 text-xl font-bold px-4 pr-12" : "h-11 text-sm px-4 pr-10",
            icon ? (isLarge ? "pl-20" : "pl-14") : "",
            disabled && "opacity-50 cursor-not-allowed",
            selectClassName
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled className="bg-[#292524] text-slate-400">
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-[#292524] text-white">
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-focus-within:text-primary transition-colors flex items-center justify-center">
          <span className="material-symbols-outlined text-xl">expand_more</span>
        </div>
      </div>
    </div>
  );
}
