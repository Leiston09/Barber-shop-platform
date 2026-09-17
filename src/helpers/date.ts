import { format, parse, parseISO, isValid } from "date-fns";
import { es } from "date-fns/locale";

export function displayDate(date: string | Date): string {
  const newDate =
    typeof date === "string"
      ? parseISO(date)
      : date;

  if (!isValid(newDate)) {
    return "";
  }

  return format(newDate, "PPPP", {
    locale: es,
  });
}

export function convertToDatePicker(date: string | Date): string {
  if (typeof date === "string") {
    const parsedDate = parseISO(date);

    if (isValid(parsedDate)) {
      return format(parsedDate, "yyyy-MM-dd");
    }

    const parsedLegacyDate = parse(
      date,
      "dd/MM/yyyy",
      new Date()
    );

    if (isValid(parsedLegacyDate)) {
      return format(parsedLegacyDate, "yyyy-MM-dd");
    }

    return "";
  }

  if (!isValid(date)) {
    return "";
  }

  return format(date, "yyyy-MM-dd");
}