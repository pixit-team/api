import i18next from "i18next";
import i18nextSyncBackend from "i18next-sync-fs-backend";
import Koa from "koa";
import KoaI18next from "koa-i18next";

export default (app: Koa): void => {
  i18next.use(i18nextSyncBackend).init({
    initImmediate: false, // Wait for loading to be completed before returning
    backend: {
      loadPath: `${__dirname}/../../assets/locales/{{lng}}/{{ns}}.json`,
    },
    preload: ["en", "fr"],
    fallbackLng: "en",
  });

  app.use(
    KoaI18next(i18next, {
      lookupQuerystring: "locale", // detect language in query
      lookupCookie: "locale", // detect language in cookie
      order: ["querystring", "cookie"],
      next: true,
    }),
  );
};
