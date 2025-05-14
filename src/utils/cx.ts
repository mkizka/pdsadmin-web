import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cx = (...inputs: Parameters<typeof clsx>) => {
  return twMerge(clsx(inputs));
};
