import { cookies } from "next/headers";
import { type Locale, DEFAULT_LOCALE, LOCALES, getDict } from "./dictionary";

export const LOCALE_COOKIE = "balesin_locale";

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const v = store.get(LOCALE_COOKIE)?.value;
  if (v && (LOCALES as readonly string[]).includes(v)) {
    return v as Locale;
  }
  return DEFAULT_LOCALE;
}

export async function getT() {
  const locale = await getLocale();
  return { locale, t: getDict(locale) };
}
