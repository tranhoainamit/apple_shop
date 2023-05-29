/* eslint global-require: off, no-extend-native: off, new-cap: off */
/* global Number: true, Intl, require */
// Feature detection from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString

function toLocaleStringSupportsLocales() {
  const number = 0;

  try {
    number.toLocaleString('i');
  } catch (e) {
    return e.name === 'RangeError';
  }

  return false;
}

function toLocaleStringSupportsOptions() {
  return !!(typeof Intl === 'object' && Intl && typeof Intl.NumberFormat === 'function');
}

module.exports = function polyfill(force = false) {
  if (!force && toLocaleStringSupportsLocales() && toLocaleStringSupportsOptions()) {
    return;
  }

  const localeLoaded = {};

  const Globalize = require('globalize');
  const cldrData = require('cldr-data');

  Globalize.load(cldrData.entireSupplemental());

  const original = Number.prototype.toLocaleString;

  Number.prototype.toLocaleString = function toLocaleString(lcl, opts) {
    const options = opts || {};

    // No currency support yet
    if (options.style === 'currency') {
      return original.call(this, lcl, options);
    }

    const locale = lcl || 'en';

    if (!localeLoaded[locale]) {
      let localeData;

      try {
        localeData = cldrData.entireMainFor(locale);
      } catch (e) {}

      if (!localeData) {
        try {
          const attributes = Globalize(locale).cldr.attributes;
          const { bundle, maxLanguageId } = attributes;
          const approximated = bundle || maxLanguageId;

          if (approximated) {
            localeData = cldrData.entireMainFor(approximated);
          }
        } catch (e) {}
      }

      if (!localeData) {
        return this.toString();
      }

      Globalize.load(localeData);
      localeLoaded[locale] = true;
    }

    const formatter = Globalize(locale).numberFormatter(options);

    return formatter(this.valueOf());
  };
};
