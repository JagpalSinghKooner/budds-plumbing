/**
 * Utility functions for working with Sanity CMS data
 *
 * Sanity returns `null` for optional/missing fields, but TypeScript
 * prefers `undefined`. These utilities handle the conversion properly.
 */

/**
 * Converts null to undefined for a single value
 * Preserves all other values including false, 0, empty string, etc.
 */
export function nullToUndefined<T>(value: T | null): T | undefined {
  return value === null ? undefined : value;
}

/**
 * Converts all null values in an object to undefined
 * Does a shallow conversion - only converts top-level properties
 */
export function nullToUndefinedShallow<T extends Record<string, unknown>>(
  obj: T | null
): { [K in keyof T]: T[K] extends null ? undefined : T[K] } | undefined {
  if (obj === null || obj === undefined) {
    return undefined;
  }

  const result = {} as { [K in keyof T]: T[K] extends null ? undefined : T[K] };

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = (
        obj[key] === null ? undefined : obj[key]
      ) as (typeof result)[typeof key];
    }
  }

  return result;
}

/**
 * Filters an array and converts null values to undefined
 * Also removes null/undefined items from the array
 */
export function filterAndConvertArray<T>(
  array: (T | null)[] | null | undefined
): T[] {
  if (!array) {
    return [];
  }

  return array.filter((item): item is T => item !== null && item !== undefined);
}

/**
 * Type guard to check if a value is defined (not null or undefined)
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Converts Sanity business hours format to a typed format
 * Filters out incomplete entries and ensures type safety
 */
export function convertBusinessHours(
  hours:
    | Array<{
        day:
          | 'Monday'
          | 'Tuesday'
          | 'Wednesday'
          | 'Thursday'
          | 'Friday'
          | 'Saturday'
          | 'Sunday'
          | null;
        open: string | null;
        close: string | null;
      }>
    | null
    | undefined
): Array<{ day: string; open: string; close: string }> {
  if (!hours) {
    return [];
  }

  return hours
    .filter(
      (
        hour
      ): hour is {
        day:
          | 'Monday'
          | 'Tuesday'
          | 'Wednesday'
          | 'Thursday'
          | 'Friday'
          | 'Saturday'
          | 'Sunday';
        open: string;
        close: string;
      } => isDefined(hour.day) && isDefined(hour.open) && isDefined(hour.close)
    )
    .map(({ day, open, close }) => ({ day, open, close }));
}
