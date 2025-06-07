import React, { createContext, useContext, useState, useEffect } from "react";

// Context for managing docs mode state
interface DocsContextType {
  isDocsMode: boolean;
  toggleDocsMode: () => void;
  openDocs: (componentName: string) => void;
  selectedComponent: string | null;
  discoveredComponents: Map<string, string>; // componentName -> componentPath
  registerComponent: (componentName: string, componentPath: string) => void;
}

const DocsContext = createContext<DocsContextType | null>(null);

export const useDocsMode = () => {
  const context = useContext(DocsContext);
  if (!context) {
    throw new Error("useDocsMode must be used within a DocsProvider");
  }
  return context;
};

// Provider component that manages docs mode state
export const DocsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isDocsMode, setIsDocsMode] = useState(() => {
    // Check for docsMode query parameter on initialization
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get("docsMode") === "true";
    }
    return false;
  });
  const [selectedComponent, setSelectedComponent] = useState<string | null>(
    null
  );
  const [discoveredComponents, setDiscoveredComponents] = useState<
    Map<string, string>
  >(new Map());

  const toggleDocsMode = () => {
    setIsDocsMode(!isDocsMode);
    if (!isDocsMode) {
      setSelectedComponent(null);
    }
  };

  const openDocs = (componentName: string) => {
    setSelectedComponent(componentName);
  };

  const registerComponent = (componentName: string, componentPath: string) => {
    setDiscoveredComponents((prev) =>
      new Map(prev).set(componentName, componentPath)
    );
  };

  // Close docs when clicking outside in docs mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isDocsMode) {
        setSelectedComponent(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
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
    React.useEffect(() => {
      registerComponent(componentName, componentPath);
    }, [componentName, componentPath, registerComponent]);

    // In docs mode, wrap with highlighting and click handler
    if (isDocsMode) {
      return (
        <div
          className="relative group cursor-pointer"
          onClick={(e) => {
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
            onClick={(e) => {
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
  const { selectedComponent, isDocsMode, openDocs } = useDocsMode();
  const [isOpen, setIsOpen] = useState(false);

  // Open drawer when component is selected
  useEffect(() => {
    if (selectedComponent) {
      setIsOpen(true);
    }
  }, [selectedComponent]);

  const closeDrawer = () => {
    setIsOpen(false);
    // Small delay to allow animation before clearing selected component
    setTimeout(() => openDocs(""), 300);
  };

  if (!isDocsMode || !selectedComponent) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={closeDrawer}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gray-50 flex-shrink-0">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Component Documentation
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {selectedComponent.split("/").pop()?.replace("#", " → ")}
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
        <div className="flex-1 min-h-0">
          <iframe
            src={selectedComponent}
            className="w-full h-full border-0"
            title="Component Documentation"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
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
            ? "bg-blue-500/20 hover:bg-blue-500/30 border-blue-400/50"
            : "bg-white/10 hover:bg-white/20"
        }`}
        title={isDocsMode ? "Exit docs mode" : "Enter docs mode"}
      >
        <svg
          className={`w-5 h-5 transition-colors ${
            isDocsMode ? "text-blue-300" : "text-white/80"
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

      {/* Components count indicator */}
      {isDocsMode && discoveredComponents.size > 0 && (
        <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-medium">
          {discoveredComponents.size}
        </div>
      )}
    </div>
  );
};

// Helper component for displaying discovered components
export const DocsComponentsList: React.FC = () => {
  const { isDocsMode, discoveredComponents, openDocs } = useDocsMode();
  const [isExpanded, setIsExpanded] = useState(false);

  // Start expanded when entering docs mode, reset when leaving
  useEffect(() => {
    if (isDocsMode) {
      setIsExpanded(true);
    } else {
      setIsExpanded(false);
    }
  }, [isDocsMode]);

  if (!isDocsMode || discoveredComponents.size === 0) {
    return null;
  }

  // Collapsed state - small button below docs toggle
  if (!isExpanded) {
    return (
      <div className="fixed left-6 top-36 z-40">
        <button
          onClick={() => setIsExpanded(true)}
          className="w-12 h-12 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl flex items-center justify-center transition-all duration-300 hover:bg-white/20 group"
          title={`View ${discoveredComponents.size} discovered components`}
        >
          <div className="relative">
            {/* Components icon */}
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
            {/* Count badge */}
            <div className="absolute -top-2 -right-2 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-medium">
              {discoveredComponents.size}
            </div>
          </div>
        </button>
      </div>
    );
  }

  // Expanded state - full menu
  return (
    <div className="fixed left-6 top-36 z-40">
      <div
        className={`bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl transition-all duration-500 ease-out transform ${
          isExpanded
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 translate-y-2"
        }`}
        style={{
          maxWidth: "20rem",
          minWidth: "16rem",
        }}
      >
        {/* Header with collapse button */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h3 className="text-white text-sm font-medium">
            Components ({discoveredComponents.size})
          </h3>
          <button
            onClick={() => setIsExpanded(false)}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors group"
            title="Collapse components list"
          >
            <svg
              className="w-4 h-4 text-white/60 group-hover:text-white transition-colors"
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
              ([componentName, componentPath], index) => {
                return (
                  <button
                    key={componentName}
                    onClick={() => openDocs(componentPath)}
                    className={`block w-full text-left text-white/80 hover:text-white text-xs p-2 hover:bg-white/10 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                      isExpanded ? "animate-slideIn" : ""
                    }`}
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                      <span className="truncate">{componentName}</span>
                    </div>
                  </button>
                );
              }
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
