import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getGreeting(date = new Date()) {
  const hours = date.getHours();

  if (hours < 12) {
    return "Good morning";
  }

  if (hours < 18) {
    return "Good afternoon";
  }

  return "Good evening";
}

export function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(dateString));
}

export function daysBetween(start: string, end = new Date().toISOString()) {
  const diff = new Date(end).getTime() - new Date(start).getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}
