/*
 * Generated type guards for "CommanderOptions.ts".
 * WARNING: Do not manually change this file.
 */
import { CommanderOptions } from "./CommanderOptions";

export function areValidOptions(
  obj: any,
  _argumentName?: string
): obj is CommanderOptions {
  return (
    ((obj !== null && typeof obj === "object") || typeof obj === "function") &&
    typeof obj.token === "string" &&
    typeof obj.clientId === "string" &&
    (typeof obj.ownerId === "undefined" || typeof obj.ownerId === "string")
  );
}
