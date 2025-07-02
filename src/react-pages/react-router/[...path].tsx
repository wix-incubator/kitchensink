import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import WixServicesProvider from '../../providers/WixServicesProvider';
import Cart from '../../components/ecom/Cart';
import { type NavigationComponent, NavigationProvider } from '../../components/NavigationContext';
import { StoreRoute, ProductDetailsRoute, GlobalCartLoader } from './Routes';



const ReactRouterNavigationComponent: NavigationComponent = ({ route, children, ...props }) => {
  return <Link to={route} {...props}>{children}</Link>;
};

export default function ReactRouterApp() {
  return (
    <div className="min-h-screen bg-surface-primary p-4 pt-16" data-testid="main-container">
      <Router basename="/react-router">
        <WixServicesProvider showCartIcon={true}>
        <NavigationProvider navigationComponent={ReactRouterNavigationComponent}>
          <GlobalCartLoader>
            <Routes>
              {/* Default route redirects to store */}
              <Route path="/" element={<Navigate to="/store" replace />} />
              
              {/* Store/Product List Route with Categories Loading */}
              <Route 
                path="/store" 
                element={<StoreRoute />} 
              />
              
              {/* Product Details Route */}
              <Route 
                path="/products/:slug" 
                element={<ProductDetailsRoute />} 
              />
              
              {/* Cart Route */}
              <Route 
                path="/cart" 
                element={<Cart />}
              />
              
              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/store" replace />} />
            </Routes>
          </GlobalCartLoader>
          </NavigationProvider>
        </WixServicesProvider>
      </Router>
    </div>
  );
} 