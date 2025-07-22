import { describe, it, expect } from 'vitest';
import { buildSearchOptionsFromUrl } from './parseSearchOptionsFromUrl';

describe('parseSearchOptionsFromUrl', () => {
  it('should parse search options from url with text query', () => {
    const url = 'https://example.com/search?q=test';
    const searchOptions = buildSearchOptionsFromUrl(url);
    expect(searchOptions).toEqual({
      search: {
        expression: 'test',
      },
    });
  });

  it('should parse pagination options', () => {
    const url = 'https://example.com/search?limit=20&cursor=abc123';
    const searchOptions = buildSearchOptionsFromUrl(url);
    expect(searchOptions).toEqual({
      cursorPaging: {
        limit: 20,
        cursor: 'abc123',
      },
    });
  });

  it('should parse filter options', () => {
    const url = 'https://example.com/search?visible=true&category=123';
    const searchOptions = buildSearchOptionsFromUrl(url);
    expect(searchOptions).toEqual({
      filter: {
        visible: true,
        'directCategoriesInfo.categories._id': '123',
      },
    });
  });

  it('should parse multiple options combined', () => {
    const url =
      'https://example.com/search?q=shirt&limit=10&visible=true&sort=name:asc';
    const searchOptions = buildSearchOptionsFromUrl(url);
    expect(searchOptions).toEqual({
      search: {
        expression: 'shirt',
      },
      cursorPaging: {
        limit: 10,
      },
      filter: {
        visible: true,
      },
      sort: [
        {
          fieldName: 'name',
          order: 'ASC',
        },
      ],
    });
  });

  it('should parse price range filters', () => {
    const url = 'https://example.com/search?minPrice=10.50&maxPrice=99.99';
    const searchOptions = buildSearchOptionsFromUrl(url);
    expect(searchOptions).toEqual({
      filter: {
        'actualPriceRange.minValue.amount': {
          $gte: 10.5,
        },
        'actualPriceRange.maxValue.amount': {
          $lte: 99.99,
        },
      },
    });
  });

  it('should handle brand filtering gracefully (not supported)', () => {
    const url = 'https://example.com/search?brand=test-brand-id';
    const searchOptions = buildSearchOptionsFromUrl(url);
    expect(searchOptions).toEqual({});
  });

  it('should handle unknown sort fields gracefully', () => {
    const url = 'https://example.com/search?sort=unknown:desc';
    const searchOptions = buildSearchOptionsFromUrl(url);
    expect(searchOptions).toEqual({});
  });

  it('should parse product type filter', () => {
    const url = 'https://example.com/search?productType=PHYSICAL';
    const searchOptions = buildSearchOptionsFromUrl(url);
    expect(searchOptions).toEqual({
      filter: {
        productType: 'PHYSICAL',
      },
    });
  });

  it('should return empty object for URL without search params', () => {
    const url = 'https://example.com/search';
    const searchOptions = buildSearchOptionsFromUrl(url);
    expect(searchOptions).toEqual({});
  });

  describe('default values', () => {
    it('should set default values for search options', () => {
      const url = 'https://example.com/search';
      const searchOptions = buildSearchOptionsFromUrl(url);
      expect(searchOptions).toEqual({
        cursorPaging: {
          limit: 100,
        },
      });
    });
  });
});
