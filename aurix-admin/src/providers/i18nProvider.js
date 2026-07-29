import polyglotI18nProvider from 'ra-i18n-polyglot';
import portugueseMessages from 'ra-language-portuguese';

const messages = {
  pt: portugueseMessages,
};

export const i18nProvider = polyglotI18nProvider(
  locale => messages[locale] || messages.pt,
  'pt'
);
