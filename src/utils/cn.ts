import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: Parameters<typeof clsx>) => {
  return twMerge(clsx(inputs));
};
