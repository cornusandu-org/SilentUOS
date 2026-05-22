export const DEBUG = "DEBUG";
export const INFO = "INFO";
export const WARNING = "WARNING";
export const ERROR = "ERROR";
export const CRITICAL = "CRITICAL";

export function out(level, message) {
    console.log(`[${level}] ${message}`);
}
