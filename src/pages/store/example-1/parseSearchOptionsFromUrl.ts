import { productsV3 } from '@wix/stores';

export type SearchOptions = Parameters<typeof productsV3.searchProducts>[0];

export function parseSearchOptionsFromUrl(url: string): SearchOptions {
  const urlObj = new URL(url);
  const searchParams = urlObj.searchParams;

  const searchOptions: SearchOptions = {
    cursorPaging: {
      limit: 100,
    },
  };

  // Handle text search (q parameter)
  const query = searchParams.get('q');
  if (query) {
    searchOptions.search = {
      expression: query,
    };
  }

  // Handle pagination
  const limit = searchParams.get('limit');
  const cursor = searchParams.get('cursor');
  if (limit || cursor) {
    searchOptions.cursorPaging = {};
    if (limit) {
      const limitNum = parseInt(limit, 10);
      if (!isNaN(limitNum) && limitNum > 0) {
        searchOptions.cursorPaging.limit = limitNum;
      }
    }
    if (cursor) {
      searchOptions.cursorPaging.cursor = cursor;
    }
  }

  // Handle sorting - using predefined sort options
  const sort = searchParams.get('sort');
  if (sort) {
    // Map common sort parameters to known fields
    const sortMapping: Record<string, string> = {
      name: 'name',
      price: 'actualPriceRange.minValue.amount',
      created: '_createdDate',
      updated: '_updatedDate',
    };

    const sortParts = sort.split(':');
    const fieldKey = sortParts[0].toLowerCase();
    const order = sortParts[1]?.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

    const mappedField = sortMapping[fieldKey];
    if (mappedField) {
      searchOptions.sort = [
        {
          fieldName: mappedField as any, // Type assertion for known valid fields
          order,
        },
      ];
    }
  }

  // Handle filtering
  const filter: Record<string, any> = {};

  // Common filter parameters
  const visible = searchParams.get('visible');
  if (visible !== null) {
    filter.visible = visible === 'true';
  }

  const productType = searchParams.get('productType');
  if (productType) {
    filter.productType = productType;
  }

  const category = searchParams.get('category');
  if (category) {
    filter['allCategoriesInfo.categories'] = {
      $matchItems: [{ _id: { $in: [category] } }],
    };
  }

  // Note: brand._id is not filterable in Wix API
  // const brand = searchParams.get('brand');
  // if (brand) {
  //   filter['brand._id'] = brand;
  // }

  // Price range filtering - use separate filters for min and max price
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  if (minPrice) {
    const minPriceNum = parseFloat(minPrice);
    if (!isNaN(minPriceNum)) {
      filter['actualPriceRange.minValue.amount'] = { $gte: minPriceNum };
    }
  }
  if (maxPrice) {
    const maxPriceNum = parseFloat(maxPrice);
    if (!isNaN(maxPriceNum)) {
      filter['actualPriceRange.maxValue.amount'] = { $lte: maxPriceNum };
    }
  }

  // Add filter to search options if any filters were set
  if (Object.keys(filter).length > 0) {
    searchOptions.filter = filter;
  }

  searchOptions.aggregations = [
    // Price range aggregations
    {
      name: 'minPrice',
      fieldPath: 'actualPriceRange.minValue.amount',
      type: 'SCALAR' as const,
      scalar: { type: 'MIN' as const },
    },
    {
      name: 'maxPrice',
      fieldPath: 'actualPriceRange.maxValue.amount',
      type: 'SCALAR' as const,
      scalar: { type: 'MAX' as const },
    },
    // Options aggregations
    {
      name: 'optionNames',
      fieldPath: 'options.name',
      type: productsV3.SortType.VALUE,
      value: {
        limit: 20,
        sortType: productsV3.SortType.VALUE,
        sortDirection: productsV3.SortDirection.ASC,
      },
    },
    {
      name: 'choiceNames',
      fieldPath: 'options.choicesSettings.choices.name',
      type: productsV3.SortType.VALUE,
      value: {
        limit: 50,
        sortType: productsV3.SortType.VALUE,
        sortDirection: productsV3.SortDirection.ASC,
      },
    },
    {
      name: 'inventoryStatus',
      fieldPath: 'inventory.availabilityStatus',
      type: productsV3.SortType.VALUE,
      value: {
        limit: 10,
        sortType: productsV3.SortType.VALUE,
        sortDirection: productsV3.SortDirection.ASC,
      },
    },
  ];

  return searchOptions;
}
