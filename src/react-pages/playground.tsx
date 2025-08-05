import React, { useState, createContext, useContext, isValidElement, cloneElement, useCallback, forwardRef } from 'react';

// --- Data Models and Dummy Data ---
interface ProductData {
  id: string;
  name: string;
  price: number;
}
const dummyProducts: ProductData[] = [
  { id: '1', name: 'Awesome T-Shirt', price: 25.00 },
  { id: '2', name: 'Cool Jeans', price: 50.00 },
  { id: '3', name: 'Fancy Hat', price: 15.00 },
  { id: '4', name: 'Vintage T-Shirt', price: 30.00 },
  { id: '5', name: 'Modern Jacket', price: 75.00 },
];

// --- Contexts and Hooks ---
interface ProductListContextProps { products: ProductData[]; count: number; originalProducts: ProductData[]; originalCount: number; }
const ProductListContext = createContext<ProductListContextProps | null>(null);
const useProductListContext = () => {
  const context = useContext(ProductListContext);
  if (!context) throw new Error('This component must be wrapped inside <ProductList.Root />');
  return context;
};

interface Filters { name: string; }
interface FilterContextProps { filters: Filters; setFilters: React.Dispatch<React.SetStateAction<Filters>>; }
const FilterContext = createContext<FilterContextProps | null>(null);
const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) throw new Error('This component must be wrapped inside <ProductList.Root />');
  return context;
};

// --- Single Product Components ---
interface ProductRootProps { product: ProductData; className?: string; children?: React.ReactNode; }
const ProductContext = createContext<ProductData | null>(null);
const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error('Product components must be wrapped inside <Product.Root />');
  return context;
};
export const Product = {
  Root: ({ product, children, ...props }: ProductRootProps) => (
    <ProductContext.Provider value={product}>
      <div {...props}>{children}</div>
    </ProductContext.Provider>
  ),
  Name: forwardRef<HTMLElement, { asChild?: boolean; className?: string; children: React.ReactNode; }>(
    ({ asChild, children, ...props }, ref) => {
      const product = useProductContext();
      if (asChild) {
        const child = React.Children.only(children);
        return cloneElement(child as React.ReactElement, { ...props, ref, children: product.name });
      }
      return <h2 {...props} ref={ref as React.RefObject<HTMLHeadingElement>}>{product.name}</h2>;
    }
  ),
  Price: forwardRef<HTMLElement, { asChild?: boolean; className?: string; children: React.ReactNode; }>(
    ({ asChild, children, ...props }, ref) => {
      const product = useProductContext();
      if (asChild) {
        const child = React.Children.only(children);
        return cloneElement(child as React.ReactElement, { ...props, ref, children: `$${product.price.toFixed(2)}` });
      }
      return <span {...props} ref={ref as React.RefObject<HTMLSpanElement>}>${product.price.toFixed(2)}</span>;
    }
  ),
};

const ProductListProducts = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

const ProductListProduct = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  const { products } = useProductListContext();
  return (
    <>
      {products.map(product => (
        <Product.Root key={product.id} product={product}>
          <div className={className}>
            {children}
          </div>
        </Product.Root>
      ))}
    </>
  );
};

const ProductListEmptyState = ({ className, children, ...props }: { className?: string; children?: React.ReactNode; }) => {
  const { products } = useProductListContext();
  return (
    products.length > 0 ? null : <div className={className} {...props}>
      {children}
    </div>
  );
};

export const ProductList = {
  Root: ({ products, children, ...props }: { products: ProductData[]; children: React.ReactNode; className?: string; }) => {
    const [filters, setFilters] = useState<Filters>({ name: '' });
    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(filters.name.toLowerCase()));
    const listContextValue = { products: filteredProducts, count: filteredProducts.length, originalProducts: products, originalCount: products.length };
    const filterContextValue = { filters, setFilters };


    return (
      <ProductListContext.Provider value={listContextValue}>
        <FilterContext.Provider value={filterContextValue}>
          {children}
        </FilterContext.Provider>
      </ProductListContext.Provider>
    );
  },

  // ignore this component, it's just for demo purposes
  Filters: ({ className, ...props }: { className?: string; }) => {
    const { filters, setFilters } = useFilters();
    const handleNameFilterChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
      setFilters(prev => ({ ...prev, name: event.target.value }));
    }, [setFilters]);
    return (
      <div className={className} {...props}>
        <label className="font-semibold text-gray-700">Filter by name:</label>
        <input type="text" value={filters.name} onChange={handleNameFilterChange}
               className="border p-1 rounded-md ml-2" placeholder="e.g., T-Shirt" />
      </div>
    );
  },

  // ignore this component, it's just for demo purposes
  Info: ({ className, ...props }: { className?: string; }) => {
    const { count, originalCount } = useProductListContext();
    const text = count === originalCount ? `Showing ${count} products` : `Showing ${count} of ${originalCount} products`;
    return <p className={className} {...props}>{text}</p>;
  },

  Products: ProductListProducts,
  Product: ProductListProduct,
  EmptyState: ProductListEmptyState,
};

// --- Main App Component ---
export default function App() {
  return (
    <div className="p-8 font-sans bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Product Gallery</h1>
      
      <ProductList.Root products={dummyProducts} className="flex flex-col gap-6">
        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
          <ProductList.Info className="text-sm text-gray-600" />
          <ProductList.Filters />
        </div>

        <ProductList.Products className="pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <ProductList.Product className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Product.Name asChild>
                <h2 className="text-xl font-semibold text-gray-800" />
              </Product.Name>
              <Product.Price asChild>
                <span className="text-lg font-bold text-green-600 mt-1 block" />
              </Product.Price>
            </ProductList.Product>
          </div>
        </ProductList.Products>

        <ProductList.EmptyState className="text-center bg-white p-8 rounded-lg text-gray-500 shadow-md">
          <p className="text-lg">No products found.</p>
        </ProductList.EmptyState>
      </ProductList.Root>
    </div>
  );
}