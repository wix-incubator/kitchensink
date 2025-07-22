import { Product } from '@wix/headless-stores/react';
import { type ProductsListServiceConfig } from './products-list';
import { ProductsList } from './products-list-components';
import { ProductsListFilters } from './products-list-filters-components';
import { ProductsListPagination } from './products-list-pagination-components';
import { ProductsListSort } from './products-list-sort-components';
import { SortType } from './products-list-sort';
import { InventoryStatusType } from './products-list-filters';
import { CategoriesList } from './categories-list-components';
import type { CategoriesListServiceConfig } from './categories-list';
import { Category } from './category-components';

export function ProductsListPage({
  productsListConfig,
  categoriesListConfig,
}: {
  productsListConfig: ProductsListServiceConfig;
  categoriesListConfig: CategoriesListServiceConfig;
}) {
  return (
    <>
      <div>
        <h1>Categories</h1>
      </div>
      <CategoriesList.Root categoriesListConfig={categoriesListConfig}>
        <CategoriesList.ItemContent>
          <Category.Name>{({ name }) => <h3>{name}</h3>}</Category.Name>
        </CategoriesList.ItemContent>
        <ProductsList.Root productsListConfig={productsListConfig}>
          <div>
            <h1>Products</h1>
            <ProductsListPagination.Root>
              <div>
                <h2>Pagination</h2>
              </div>
              <ProductsListPagination.PageSize>
                {({ currentLimit, setLimit }) => (
                  <>
                    <div>
                      <label>Items per page:</label>
                      <select
                        value={currentLimit}
                        onChange={e => setLimit(Number(e.target.value))}
                      >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </select>
                    </div>
                    <div>Showing up to {currentLimit} products</div>
                  </>
                )}
              </ProductsListPagination.PageSize>

              <div>
                <ProductsListPagination.FirstPage>
                  {({ goToFirstPage, hasPrevPage }) => (
                    <button
                      onClick={goToFirstPage}
                      disabled={!hasPrevPage}
                      data-testid="first-page-btn"
                    >
                      First
                    </button>
                  )}
                </ProductsListPagination.FirstPage>
                <ProductsListPagination.PrevPage>
                  {({ prevPage, hasPrevPage }) => (
                    <button
                      onClick={prevPage}
                      disabled={!hasPrevPage}
                      data-testid="prev-page-btn"
                    >
                      Previous
                    </button>
                  )}
                </ProductsListPagination.PrevPage>
                <ProductsListPagination.NextPage>
                  {({ nextPage, hasNextPage }) => (
                    <button
                      onClick={nextPage}
                      disabled={!hasNextPage}
                      data-testid="next-page-btn"
                    >
                      Next
                    </button>
                  )}
                </ProductsListPagination.NextPage>
              </div>
            </ProductsListPagination.Root>

            <ProductsListSort.Root>
              <div>
                <h2>Sort</h2>
              </div>
              <ProductsListSort.Options>
                {({
                  selectedSortOption,
                  setSelectedSortOption,
                  sortOptions,
                }) => (
                  <div>
                    <label>Sort</label>
                    <select
                      value={selectedSortOption}
                      onChange={e => setSelectedSortOption(e.target.value)}
                    >
                      {sortOptions.map(option => (
                        <option key={option} value={option}>
                          {(() => {
                            switch (option) {
                              case SortType.NAME_ASC:
                                return 'Name (A-Z)';
                              case SortType.NAME_DESC:
                                return 'Name (Z-A)';
                              case SortType.PRICE_ASC:
                                return 'Price (Low to High)';
                              case SortType.PRICE_DESC:
                                return 'Price (High to Low)';
                              case SortType.NEWEST:
                                return 'Newest First';
                              case SortType.RECOMMENDED:
                                return 'Recommended';
                            }
                          })()}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </ProductsListSort.Options>
            </ProductsListSort.Root>

            <ProductsListFilters.Root>
              <div>
                <div>
                  <h2>Filters</h2>
                </div>

                <div>
                  <ProductsListFilters.MinPrice>
                    {({ minPrice, setMinPrice }) => (
                      <div>
                        <label>Min Price</label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={minPrice || ''}
                          onChange={e =>
                            setMinPrice(parseFloat(e.target.value) || 0)
                          }
                          placeholder="0.00"
                        />
                      </div>
                    )}
                  </ProductsListFilters.MinPrice>

                  <ProductsListFilters.MaxPrice>
                    {({ maxPrice, setMaxPrice }) => (
                      <div>
                        <label>Max Price</label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={maxPrice || ''}
                          onChange={e =>
                            setMaxPrice(parseFloat(e.target.value) || 0)
                          }
                          placeholder="0.00"
                        />
                      </div>
                    )}
                  </ProductsListFilters.MaxPrice>

                  <ProductsListFilters.InventoryStatus>
                    {({
                      availableInventoryStatuses,
                      selectedInventoryStatuses,
                      toggleInventoryStatus,
                    }) => (
                      <div>
                        <label>Availability</label>
                        <div>
                          {availableInventoryStatuses.map(status => (
                            <div key={status}>
                              <label>
                                <input
                                  type="checkbox"
                                  checked={selectedInventoryStatuses.includes(
                                    status
                                  )}
                                  onChange={() => toggleInventoryStatus(status)}
                                />
                                <span>
                                  {(() => {
                                    switch (status) {
                                      case InventoryStatusType.IN_STOCK:
                                        return 'In Stock';
                                      case InventoryStatusType.OUT_OF_STOCK:
                                        return 'Out of Stock';
                                      case InventoryStatusType.PARTIALLY_OUT_OF_STOCK:
                                        return 'Partially Available';
                                    }
                                  })()}
                                </span>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </ProductsListFilters.InventoryStatus>
                </div>
              </div>
            </ProductsListFilters.Root>

            <div>
              <ProductsList.Loading>
                <div>Loading products...</div>
              </ProductsList.Loading>

              <ProductsList.Error>
                <div>Failed to load products. Please try again.</div>
              </ProductsList.Error>

              <ProductsList.EmptyState>
                <div>No products found matching your criteria.</div>
              </ProductsList.EmptyState>

              <div>
                <ProductsList.ItemContent>
                  <div>
                    <Product.Name>{({ name }) => <h3>{name}</h3>}</Product.Name>
                  </div>
                </ProductsList.ItemContent>
              </div>
            </div>
          </div>
        </ProductsList.Root>
      </CategoriesList.Root>
    </>
  );
}
