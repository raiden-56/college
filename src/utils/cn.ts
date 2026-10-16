import { clsx, type ClassValue } from 'clsx';

/** Compose conditional class names. */
export const cn = (...inputs: ClassValue[]) => clsx(inputs);
