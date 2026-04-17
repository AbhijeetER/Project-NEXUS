import { clsx,ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs:ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const VITE_CLERK_PUBLISHABLE_KEY="pk_test_YXdhcmUtc3BhbmllbC0zNy5jbGVyay5hY2NvdW50cy5kZXYk"
