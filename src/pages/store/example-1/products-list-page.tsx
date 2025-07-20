import { Product } from '@wix/headless-stores/react';
import { type ProductsListServiceConfig } from './products-list';
import { ProductsList } from './products-list-components';
import { ProductsListFilters } from './products-list-filters-components';
import { ProductsListPagination } from './products-list-pagination-components';
import { ProductsListSort } from './products-list-sort-components';

export function ProductsListPage({
  productsListConfig,
}: {
  productsListConfig: ProductsListServiceConfig;
}) {
  return (
    <ProductsList.Root productsListConfig={productsListConfig}>
      <ProductsListPagination.Root productsListConfig={productsListConfig}>
        <div className="bg-surface-primary p-6">
          <h1 className="text-content-primary text-2xl font-bold mb-6">
            Products
          </h1>

          {/* Filters and Page Size Controls */}
          <ProductsListFilters.Root productsListConfig={productsListConfig}>
            <div className="bg-surface-card border-surface-primary border rounded-lg p-4 mb-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-content-primary text-lg font-semibold">
                  Filters
                </h2>

                {/* Page Size Selector */}
                <ProductsListPagination.PageSize>
                  {({ currentLimit, setLimit }) => (
                    <div className="flex items-center gap-2">
                      <label className="text-content-secondary text-sm">
                        Items per page:
                      </label>
                      <select
                        value={currentLimit}
                        onChange={e => setLimit(Number(e.target.value))}
                        className="bg-surface-primary border-surface-primary border rounded px-2 py-1 text-content-primary text-sm"
                      >
                        <option value={6}>6</option>
                        <option value={12}>12</option>
                        <option value={24}>24</option>
                        <option value={48}>48</option>
                      </select>
                    </div>
                  )}
                </ProductsListPagination.PageSize>
              </div>

              <div className="flex gap-4 flex-wrap">
                <ProductsListFilters.MinPrice>
                  {({ minPrice, setMinPrice }) => (
                    <div className="flex flex-col">
                      <label className="text-content-secondary text-sm mb-1">
                        Min Price
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={minPrice || ''}
                        onChange={e =>
                          setMinPrice(parseFloat(e.target.value) || 0)
                        }
                        className="bg-surface-primary border-surface-primary border rounded px-3 py-2 text-content-primary w-32"
                        placeholder="0.00"
                      />
                    </div>
                  )}
                </ProductsListFilters.MinPrice>

                <ProductsListFilters.MaxPrice>
                  {({ maxPrice, setMaxPrice }) => (
                    <div className="flex flex-col">
                      <label className="text-content-secondary text-sm mb-1">
                        Max Price
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={maxPrice || ''}
                        onChange={e =>
                          setMaxPrice(parseFloat(e.target.value) || 0)
                        }
                        className="bg-surface-primary border-surface-primary border rounded px-3 py-2 text-content-primary w-32"
                        placeholder="0.00"
                      />
                    </div>
                  )}
                </ProductsListFilters.MaxPrice>
              </div>
            </div>
          </ProductsListFilters.Root>

          <ProductsListSort.Root>
            <ProductsListSort.Sort>
              {({ sort, setSort }) => (
                <div className="flex flex-col">
                  <label className="text-content-secondary text-sm mb-1">
                    Sort
                  </label>
                  <select
                    value={sort}
                    onChange={e => setSort(e.target.value)}
                    className="bg-surface-primary border-surface-primary border rounded px-3 py-2 text-content-primary w-44"
                  >
                    <option value="name_asc">Name (A-Z)</option>
                    <option value="name_desc">Name (Z-A)</option>
                    <option value="price_asc">Price (Low to High)</option>
                    <option value="price_desc">Price (High to Low)</option>
                    <option value="newest">Newest First</option>
                    <option value="recommended">Recommended</option>
                  </select>
                </div>
              )}
            </ProductsListSort.Sort>
          </ProductsListSort.Root>

          {/* Pagination Info */}
          <ProductsListPagination.Info>
            {({ totalCount, currentLimit }) => (
              <div className="text-content-secondary text-sm mb-4">
                Showing up to {currentLimit} of {totalCount} products
              </div>
            )}
          </ProductsListPagination.Info>

          {/* Products Section */}
          <div className="space-y-4">
            <ProductsList.Loading>
              <div className="text-content-secondary">Loading products...</div>
            </ProductsList.Loading>

            <ProductsList.Error>
              <div className="text-status-danger bg-status-danger-light border border-status-danger rounded p-4">
                Failed to load products. Please try again.
              </div>
            </ProductsList.Error>

            <ProductsList.EmptyState>
              <div className="text-content-muted text-center py-8">
                No products found matching your criteria.
              </div>
            </ProductsList.EmptyState>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <ProductsList.ItemContent>
                <div className="bg-surface-card border-surface-primary border rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <Product.Name>
                    {({ name }) => (
                      <h3 className="text-content-primary font-semibold mb-2">
                        {name}
                      </h3>
                    )}
                  </Product.Name>
                </div>
              </ProductsList.ItemContent>
            </div>
          </div>

          {/* Navigation Controls */}
          <ProductsListPagination.Navigation>
            {({ hasNextPage, hasPrevPage, nextPage, prevPage, firstPage }) => (
              <div className="flex items-center justify-center gap-3 mt-8">
                <button
                  onClick={firstPage}
                  disabled={!hasPrevPage}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded"
                  data-testid="first-page-btn"
                >
                  First
                </button>
                <button
                  onClick={prevPage}
                  disabled={!hasPrevPage}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded"
                  data-testid="prev-page-btn"
                >
                  Previous
                </button>
                <button
                  onClick={nextPage}
                  disabled={!hasNextPage}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded"
                  data-testid="next-page-btn"
                >
                  Next
                </button>
              </div>
            )}
          </ProductsListPagination.Navigation>
        </div>
      </ProductsListPagination.Root>
    </ProductsList.Root>
  );
}
