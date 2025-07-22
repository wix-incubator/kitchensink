import type { APIRoute } from 'astro';
import { productsV3 } from '@wix/stores';
import { buildSearchOptionsFromUrl } from '../store/example-1/parseSearchOptionsFromUrl';

export const GET: APIRoute = async ({ request, url }) => {
  try {
    // Get the full URL with query parameters
    const testUrl = url.href;

    console.log('Testing URL:', testUrl);

    // Parse the URL using our function
    const searchOptions = buildSearchOptionsFromUrl(testUrl);

    console.log(
      'Parsed search options:',
      JSON.stringify(searchOptions, null, 2)
    );

    // Call the actual Wix API
    const response = await productsV3.searchProducts(searchOptions);

    console.log(`Found ${response.products?.length || 0} products`);

    return new Response(
      JSON.stringify(
        {
          success: true,
          testUrl,
          searchOptions,
          results: {
            products:
              response.products?.map(product => ({
                id: product._id,
                name: product.name,
                slug: product.slug,
                visible: product.visible,
                priceRange: product.actualPriceRange,
                productType: product.productType,
                brand: product.brand,
                categories: product.directCategoriesInfo?.categories,
              })) || [],
            totalCount: response.products?.length || 0,
            hasMore: !!response.pagingMetadata?.hasNext,
            cursor: response.pagingMetadata?.cursors?.next,
            pagingMetadata: response.pagingMetadata,
          },
        },
        null,
        2
      ),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error in test-search API:', error);

    // Parse the error message if it's a JSON string
    let parsedError;
    try {
      parsedError = error instanceof Error ? JSON.parse(error.message) : error;
    } catch {
      parsedError = error instanceof Error ? error.message : String(error);
    }

    return new Response(
      JSON.stringify(
        {
          success: false,
          error: parsedError,
          originalError:
            error instanceof Error ? error.message : 'Unknown error',
          testUrl: url.href,
          searchOptions: (() => {
            try {
              return buildSearchOptionsFromUrl(url.href);
            } catch (parseError) {
              return {
                parseError:
                  parseError instanceof Error
                    ? parseError.message
                    : 'Parse error',
              };
            }
          })(),
        },
        null,
        2
      ),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};
