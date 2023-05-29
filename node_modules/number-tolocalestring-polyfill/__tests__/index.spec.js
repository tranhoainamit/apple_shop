const ALL_LOCALES = require('../test-locales');

describe('Number.prototype.polyfill', () => {
  const polyfill = require('../');

  let original;

  beforeAll(() => {
    original = Number.prototype.toLocaleString;
  });

  afterAll(() => {
    Number.prototype.toLocaleString = original;
  });

  it('should not apply in normal situations', () => {
    expect(Number.prototype.toLocaleString).toBe(original);
    polyfill();
    expect(Number.prototype.toLocaleString).toBe(original);
  });

  describe('polyfill', () => {
    beforeAll(() => {
      polyfill(true);
    });

    function compareToOriginal(num, locale) {
      it(`should format ${num} in ${locale}`, () => {
        expect(num.toLocaleString(locale)).toBe(original.call(num, locale));
      });
    }

    it('should at least do something...', () => {
      expect(Number.prototype.toLocaleString).not.toBe(original);
    });

    describe('should format strings like original (assuming node)', () => {
      let num = 1;

      while (num < Number.MAX_SAFE_INTEGER - 9) {
        ALL_LOCALES.forEach((locale) => {
          compareToOriginal(num, locale);
          compareToOriginal(-num, locale);
          compareToOriginal(num + 9, locale);
          compareToOriginal(-(num + 9), locale);
        })

        num *= 10;
      }
    });
  })
});
