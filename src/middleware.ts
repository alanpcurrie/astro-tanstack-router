import type { APIContext } from "astro";
// import { defineMiddleware, sequence } from 'astro/middleware';
// https://github.com/i7N3/astro-middleware-bug-reproduction/blob/master/src/middleware.ts

type NextFunction = () => Promise<Response>;

export async function onRequest(
  context: APIContext,
  next: NextFunction,
): Promise<Response> {
  const { request, cookies } = context;
  const url = new URL(request.url);
  const acceptLanguageHeader = request.headers.get("accept-language");
  const cookie = cookies.get("locale");
  const basePath = "/";
  const polishPath = "/pl";
  const englishLanguage = "en";
  const polishLanguage = "pl";

  if (!acceptLanguageHeader) return next();

  const acceptedLanguages = acceptLanguageHeader.split(",");
  const browserLang = acceptedLanguages[0]?.split("-")[0] || englishLanguage;

  const hasCookies =
    cookie?.value === polishLanguage || cookie?.value === englishLanguage;

  const isPolishLang = browserLang === polishLanguage;
  const isPolishUrl = url.pathname.startsWith(polishPath);
  const shouldRedirectToPolishUrl = isPolishLang && !isPolishUrl && !hasCookies;

  const redirectPath =
    url.pathname === basePath ? polishPath : `${polishPath}${url.pathname}`;

  const responseRedirect = Response.redirect(
    `${url.origin}${redirectPath}`,
    302,
  );

  if (shouldRedirectToPolishUrl) return responseRedirect;

  return next();
}
