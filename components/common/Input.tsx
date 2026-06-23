"use client";
import { useId, InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "prefix"> {
  label?: ReactNode;
  prefix?: ReactNode;
  suffix?: ReactNode;
  containerClassName?: string;
  inputClassName?: string;
  labelClassName?: string;
  size?: "md" | "lg";
}

export default function Input({
  label,
  type = "text",
  placeholder,
  prefix,
  suffix,
  containerClassName = "",
  inputClassName = "",
  labelClassName = "",
  className = "",
  size = "md",
  id,
  ...props
}: InputProps) {
  const isLarge = size === "lg";
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className={cn("flex flex-col gap-2", containerClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className={cn(
            "text-slate-300 text-xs font-bold uppercase tracking-wider flex justify-between",
            labelClassName
          )}
        >
          {typeof label === "string" ? <span>{label}</span> : label}
        </label>
      )}
      <div className="relative flex items-center group">
        {prefix && (
          <div
            className={cn(
              "absolute left-0 top-0 bottom-0 flex items-center justify-center bg-[#1c1917] border border-r-0 border-white/10 rounded-l-xl text-slate-500 font-black select-none group-focus-within:border-primary group-focus-within:text-primary transition-colors",
              isLarge ? "w-16 text-2xl" : "w-12 text-lg"
            )}
          >
            {prefix}
          </div>
        )}
        <input
          id={inputId}
          type={type}
          placeholder={placeholder}
          className={cn(
            "w-full bg-[#1c1917] border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-slate-600 font-medium outline-none transition-all",
            isLarge ? "h-20 text-4xl font-black px-4" : "h-11 text-sm px-4",
            prefix ? (isLarge ? "pl-20" : "pl-14") : "",
            suffix ? "pr-12" : "",
            type === "date" &&
              "pr-12 [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:w-8 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:top-0 [&::-webkit-calendar-picker-indicator]:bottom-0",
            type === "month" &&
              "pr-12 [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:w-8 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:top-0 [&::-webkit-calendar-picker-indicator]:bottom-0",
            inputClassName,
            className
          )}
          {...props}
        />
        {suffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
            {suffix}
          </div>
        )}
        {(type === "date" || type === "month") && !suffix && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 transition-colors group-focus-within:text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">calendar_month</span>
          </div>
        )}
      </div>
    </div>
  );
}
