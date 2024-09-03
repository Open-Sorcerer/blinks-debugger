import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAddress(address: string) {
  return `${address.slice(0, 4)}..${address.slice(-3)}`;
}

export function formatData(data: string) {
  return data.length > 12 ? `${data.slice(0, 12)}...` : data;
}
