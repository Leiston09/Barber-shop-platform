import { parse, formatISO, parseISO, format } from "date-fns";
import { es } from "date-fns/locale";

export function convertToISO(starDate: string) {
  const newDate = parse(starDate, "dd/MM/yyyy", new Date());
  return formatISO(newDate);
}

export function displayDate(date: any) {
  const newDate = parseISO(date);
  const formated = format(newDate, "PPPP", { locale: es });
  return formated;
}

export function converToDDMMYYYY(isDate : any) {
  const newDate = new Date(isDate);
  const formated = format(newDate, "dd/MM/yyyy");
  return formated;
}
