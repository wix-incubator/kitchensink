import React, { createContext, useContext, useState, useEffect } from 'react';
import { BookOpenIcon } from './icons/StackedBooksIcon';

// Context for managing docs mode state
interface DocsContextType {
  isDocsMode: boolean;
  toggleDocsMode: () => void;
  openDocs: (componentName: string, options?: { wide?: boolean }) => void;
  selectedComponent: string | null;
  discoveredComponents: Map<string, string>; // componentName -> componentPath
  registerComponent: (componentName: string, componentPath: string) => void;
  // Page docs properties
  pageTitle: string | null;
  pageDescription: string | null;
  pageDocs: string | null;
  registerPage: (title: string, description: string, docsUrl: string) => void;
  isWideDocsDrawer: boolean;
}

const DocsContext = createContext<DocsContextType | null>(null);

export const useDocsMode = () => {
  const context = useContext(DocsContext);
  if (!context) {
    throw new Error('useDocsMode must be used within a DocsProvider');
  }
  return context;
};

// Provider component that manages docs mode state
export const DocsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isDocsMode, setIsDocsMode] = useState(() => {
    // Check for docsMode query parameter on initialization
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('docsMode') === 'true';
    }
    return false;
  });
  const [selectedComponent, setSelectedComponent] = useState<string | null>(
    null
  );
  const [discoveredComponents, setDiscoveredComponents] = useState<
    Map<string, string>
  >(new Map());
  const [isWideDocsDrawer, setIsWideDocsDrawer] = useState(false);

  // Page docs state
  const [pageTitle, setPageTitle] = useState<string | null>(null);
  const [pageDescription, setPageDescription] = useState<string | null>(null);
  const [pageDocs, setPageDocs] = useState<string | null>(null);

  const toggleDocsMode = () => {
    setIsDocsMode(!isDocsMode);
    if (!isDocsMode) {
      setSelectedComponent(null);
    }
  };

  const openDocs = (componentName: string, options?: { wide?: boolean }) => {
    setSelectedComponent(componentName);
    setIsWideDocsDrawer(!!options?.wide);
  };

  const registerComponent = (componentName: string, componentPath: string) => {
    setDiscoveredComponents(prev =>
      new Map(prev).set(componentName, componentPath)
    );
    return () => {
      setDiscoveredComponents(prev => {
        const newMap = new Map(prev);
        newMap.delete(componentName);
        return newMap;
      });
    };
  };

  const registerPage = (
    title: string,
    description: string,
    docsUrl: string
  ) => {
    setPageTitle(title);
    setPageDescription(description);
    setPageDocs(docsUrl);
  };

  // Close docs when clicking outside in docs mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDocsMode) {
        setSelectedComponent(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isDocsMode]);

  return (
    <DocsContext.Provider
      value={{
        isDocsMode,
        toggleDocsMode,
        openDocs,
        selectedComponent,
        discoveredComponents,
        registerComponent,
        pageTitle,
        pageDescription,
        pageDocs,
        registerPage,
        isWideDocsDrawer,
      }}
    >
      {children}
    </DocsContext.Provider>
  );
};

// Higher-order function that wraps render prop children with docs highlighting
export const withDocsWrapper = <T extends Record<string, any>>(
  renderPropFn: (props: T) => React.ReactNode,
  componentName: string,
  componentPath: string // e.g., "/docs/components/current-member-profile#fullname"
) => {
  return (props: T) => {
    const docsContext = useContext(DocsContext);

    // If not in docs context, just render normally
    if (!docsContext) {
      return renderPropFn(props);
    }

    const { isDocsMode, openDocs, registerComponent } = docsContext;

    // Register this component as discovered
    React.useEffect(
      () => {
        return registerComponent(componentName, componentPath);
      },
      [] /* don't rereun this logic on every render */
    );

    // In docs mode, wrap with highlighting and click handler
    if (isDocsMode) {
      return (
        <div
          className="relative group cursor-pointer"
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            openDocs(componentPath);
          }}
        >
          {/* Highlight overlay */}
          <div className="absolute inset-0 bg-blue-500/20 border-2 border-blue-500 rounded-lg pointer-events-none group-hover:bg-blue-500/30 transition-colors z-10" />

          {/* Component label */}
          <div className="absolute -top-6 left-0 bg-blue-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-20 whitespace-nowrap">
            {componentName}
          </div>

          {/* Original content - prevent clicks from reaching underlying elements */}
          <div
            className="relative z-0 pointer-events-none"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            {renderPropFn(props)}
          </div>
        </div>
      );
    }

    // Normal mode, just render
    return renderPropFn(props);
  };
};

// Docs drawer component
export const DocsDrawer: React.FC = () => {
  const { selectedComponent, isDocsMode, openDocs, isWideDocsDrawer } =
    useDocsMode();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Open drawer when component is selected
  useEffect(() => {
    if (selectedComponent) {
      setIsOpen(true);
      setIsLoading(true); // Start loading when new component is selected
    }
  }, [selectedComponent]);

  // Prevent body scroll when drawer is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Prevent zoom on mobile when drawer opens
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute(
          'content',
          'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
        );
      }
    } else {
      document.body.style.overflow = '';
      // Restore normal viewport behavior
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1');
      }
    }

    return () => {
      document.body.style.overflow = '';
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1');
      }
    };
  }, [isOpen]);

  const closeDrawer = () => {
    setIsOpen(false);
    // Small delay to allow animation before clearing selected component
    setTimeout(() => openDocs(''), 300);
  };

  if (!isDocsMode || !selectedComponent) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[110] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={closeDrawer}
      />

      {/* Drawer */}
      <div
        className={`docs-drawer fixed right-0 top-0 h-full w-full ${
          isWideDocsDrawer
            ? 'sm:w-[32rem] lg:w-[48rem]'
            : 'sm:w-96 lg:w-[32rem]'
        } bg-white shadow-2xl z-[120] transform transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          // Prevent viewport scaling on mobile
          maxWidth: '100vw',
          // Ensure proper containment on mobile
          touchAction: 'manipulation',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gray-50 flex-shrink-0">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Component Documentation
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {selectedComponent.split('/').pop()?.replace('#', ' → ')}
            </p>
          </div>
          <button
            onClick={closeDrawer}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            aria-label="Close documentation"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 relative">
          {/* Loading indicator */}
          {isLoading && (
            <div className="absolute inset-0 bg-gray-50 flex items-center justify-center z-10">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="text-gray-600 text-sm">
                  Loading documentation...
                </p>
              </div>
            </div>
          )}

          <iframe
            src={selectedComponent}
            className="w-full h-full border-0"
            title="Component Documentation"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            onLoad={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
          />
        </div>
      </div>
    </>
  );
};

// Docs mode toggle button
export const DocsToggleButton: React.FC = () => {
  const { isDocsMode, toggleDocsMode, discoveredComponents } = useDocsMode();

  return (
    <div className="fixed left-6 top-20 z-50">
      <button
        onClick={toggleDocsMode}
        className={`w-12 h-12 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl flex items-center justify-center transition-all duration-300 ${
          isDocsMode
            ? 'bg-blue-500/20 hover:bg-blue-500/30 border-blue-400/50'
            : 'bg-white/10 hover:bg-white/20'
        }`}
        title={isDocsMode ? 'Exit docs mode' : 'Enter docs mode'}
      >
        <svg
          className={`w-5 h-5 transition-colors ${
            isDocsMode ? 'text-blue-300' : 'text-white/80'
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </button>

      {/* Components count indicator - shows when components are available */}
      {discoveredComponents.size > 0 && (
        <div
          className={`absolute -bottom-1 -right-1 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium transition-all duration-300 ${
            isDocsMode ? 'bg-blue-600' : 'bg-orange-500'
          }`}
        >
          {discoveredComponents.size}
        </div>
      )}
    </div>
  );
};

// Combined floating menu component that stacks page docs and components
export const DocsFloatingMenu: React.FC = () => {
  const {
    isDocsMode,
    pageTitle,
    pageDescription,
    pageDocs,
    openDocs,
    discoveredComponents,
  } = useDocsMode();
  const [isComponentsExpanded, setIsComponentsExpanded] = useState(false);
  const [isPageDocsExpanded, setIsPageDocsExpanded] = useState(false);
  const [isGeneralDocsExpanded, setIsGeneralDocsExpanded] = useState(false);

  // List of general docs
  const generalDocs = [
    {
      label: 'Overview',
      path: '/docs',
    },
    {
      label: 'Architecture & Patterns',
      path: '/docs/architecture/client-side-services',
    },
    // Add more general docs here if needed
  ];

  // Start with page docs expanded when entering docs mode, reset when leaving
  useEffect(() => {
    if (isDocsMode) {
      setIsComponentsExpanded(false); // Keep components collapsed
      setIsPageDocsExpanded(true); // Open page docs immediately
    } else {
      setIsComponentsExpanded(false);
      setIsPageDocsExpanded(false);
    }
  }, [isDocsMode]);

  if (!isDocsMode) {
    return null;
  }

  const hasPageDocs = pageTitle && pageDescription && pageDocs;
  const hasComponents = discoveredComponents.size > 0;
  const hasGeneralDocs = generalDocs.length > 0;

  return (
    <div className="fixed left-6 top-36 z-[100] flex flex-col gap-4 max-w-xs">
      {/* General Docs Section */}
      {hasGeneralDocs && (
        <>
          {/* Collapsed state - small button */}
          {!isGeneralDocsExpanded ? (
            <button
              onClick={() => setIsGeneralDocsExpanded(true)}
              className="w-12 h-12 bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-2xl flex items-center justify-center transition-all duration-300 hover:bg-white/30 group"
              title="General Docs"
            >
              <BookOpenIcon className="w-5 h-5 text-white/80 group-hover:text-white transition-colors" />
            </button>
          ) : (
            <div className="bg-white/80 backdrop-blur-lg border border-white/90 rounded-2xl shadow-2xl transition-all duration-500 ease-out transform scale-100 opacity-100 translate-y-0 min-w-64">
              {/* Header with collapse button */}
              <div className="flex items-center justify-between p-4 border-b border-white/40">
                <h3 className="text-gray-800 text-sm font-medium">
                  General Docs
                </h3>
                <button
                  onClick={() => setIsGeneralDocsExpanded(false)}
                  className="p-1 hover:bg-gray-200 rounded-lg transition-colors group"
                  title="Collapse general docs list"
                >
                  <svg
                    className="w-4 h-4 text-gray-600 group-hover:text-gray-800 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
              {/* General Docs list */}
              <div className="p-3">
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {generalDocs.map((doc, index) => (
                    <button
                      key={doc.path}
                      onClick={() => openDocs(doc.path, { wide: true })}
                      className="block w-full text-left text-gray-700 hover:text-gray-900 text-xs p-2 hover:bg-gray-200 rounded-lg transition-all duration-200 transform hover:scale-105 animate-slideIn"
                      style={{
                        animationDelay: `${index * 50}ms`,
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                        <span className="truncate">{doc.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
      {/* Page Docs Section */}
      {hasPageDocs && (
        <>
          {/* Collapsed state - small button */}
          {!isPageDocsExpanded ? (
            <button
              onClick={() => setIsPageDocsExpanded(true)}
              className="w-12 h-12 bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-2xl flex items-center justify-center transition-all duration-300 hover:bg-white/30 group"
              title="What's on this page"
            >
              <svg
                className="w-5 h-5 text-white/80 group-hover:text-white transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          ) : (
            /* Expanded state - full page docs */
            <div className="bg-white/80 backdrop-blur-lg border border-white/90 rounded-2xl shadow-2xl transition-all duration-500 ease-out transform scale-100 opacity-100 translate-y-0">
              {/* Header with collapse button */}
              <div className="flex items-center justify-between p-4 border-b border-white/40">
                <h3 className="text-gray-800 text-sm font-semibold">
                  What's on this page
                </h3>
                <button
                  onClick={() => setIsPageDocsExpanded(false)}
                  className="p-1 hover:bg-gray-200 rounded-lg transition-colors group"
                  title="Collapse page info"
                >
                  <svg
                    className="w-4 h-4 text-gray-600 group-hover:text-gray-800 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                <p className="text-gray-700 text-xs leading-relaxed mb-3">
                  {pageDescription}
                </p>

                <button
                  onClick={() => openDocs(pageDocs, { wide: true })}
                  className="text-blue-600 hover:text-blue-800 text-xs font-medium transition-colors duration-200 flex items-center gap-1 group"
                >
                  <span>Read more</span>
                  <svg
                    className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Components Section */}
      {hasComponents && (
        <>
          {/* Collapsed state - small button */}
          {!isComponentsExpanded ? (
            <button
              onClick={() => setIsComponentsExpanded(true)}
              className="w-12 h-12 bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-2xl flex items-center justify-center transition-all duration-300 hover:bg-white/30 group"
              title={`View ${discoveredComponents.size} discovered components`}
            >
              <div className="relative">
                <svg
                  className="w-5 h-5 text-white/80 group-hover:text-white transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {discoveredComponents.size}
                </div>
              </div>
            </button>
          ) : (
            /* Expanded state - full menu */
            <div className="bg-white/80 backdrop-blur-lg border border-white/90 rounded-2xl shadow-2xl transition-all duration-500 ease-out transform scale-100 opacity-100 translate-y-0 min-w-64">
              {/* Header with collapse button */}
              <div className="flex items-center justify-between p-4 border-b border-white/40">
                <h3 className="text-gray-800 text-sm font-medium">
                  Components ({discoveredComponents.size})
                </h3>
                <button
                  onClick={() => setIsComponentsExpanded(false)}
                  className="p-1 hover:bg-gray-200 rounded-lg transition-colors group"
                  title="Collapse components list"
                >
                  <svg
                    className="w-4 h-4 text-gray-600 group-hover:text-gray-800 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>

              {/* Components list */}
              <div className="p-3">
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {Array.from(discoveredComponents.entries()).map(
                    ([componentName, componentPath], index) => (
                      <button
                        key={componentName}
                        onClick={() => openDocs(componentPath)}
                        className="block w-full text-left text-gray-700 hover:text-gray-900 text-xs p-2 hover:bg-gray-200 rounded-lg transition-all duration-200 transform hover:scale-105 animate-slideIn"
                        style={{
                          animationDelay: `${index * 50}ms`,
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                          <span className="truncate">{componentName}</span>
                        </div>
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Component for pages to register their documentation
interface PageDocsRegistrationProps {
  title: string;
  description: string;
  docsUrl: string;
}

export const PageDocsRegistration: React.FC<PageDocsRegistrationProps> = ({
  title,
  description,
  docsUrl,
}) => {
  const docsContext = useContext(DocsContext);

  useEffect(() => {
    if (docsContext) {
      docsContext.registerPage(title, description, docsUrl);
    }

    // Clean up when component unmounts or page changes
    return () => {
      if (docsContext) {
        docsContext.registerPage('', '', '');
      }
    };
  }, [title, description, docsUrl, docsContext]);

  // This component renders nothing
  return null;
};
