"use server";

import { deleteCookie, getCookie, setCookie } from "../lib/cookie-helpers";

export async function getCookieAction(cookie: string)  {
    return await getCookie(cookie)
}

export async function setCookieAction(name: string, value: string, duration: number) {
    return await setCookie(name, value, duration);
}

export async function deleteCookieAction(name: string) {
    return await deleteCookie(name);
}