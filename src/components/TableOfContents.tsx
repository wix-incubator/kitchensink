import React, { useEffect, useState } from "react";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export const TableOfContents: React.FC = () => {
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    // Find all headers in the document
    const headers = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
    const items: TOCItem[] = [];

    headers.forEach((header) => {
      const level = parseInt(header.tagName.charAt(1));
      const text = header.textContent || "";

      // Create ID if it doesn't exist
      let id = header.id;
      if (!id) {
        id = text
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .trim();

        // Ensure uniqueness
        let finalId = id;
        let counter = 1;
        while (document.getElementById(finalId)) {
          finalId = `${id}-${counter}`;
          counter++;
        }

        header.id = finalId;
        id = finalId;
      }

      items.push({ id, text, level });
    });

    setTocItems(items);

    // Set up intersection observer for active section highlighting
    const observerOptions = {
      rootMargin: "-20px 0px -80% 0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    }, observerOptions);

    headers.forEach((header) => {
      observer.observe(header);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      // Close menu after navigation
      setIsMenuOpen(false);
    }
  };

  if (tocItems.length === 0) {
    return null;
  }

  return (
    <>
      {/* Backdrop for drawer */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* TOC Drawer */}
      <div
        className={`fixed right-0 top-0 h-full bg-white border-l border-gray-200 shadow-2xl z-50 transform transition-transform duration-300 ease-out flex flex-col ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ width: "380px" }}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="text-gray-700 text-sm font-medium">
            Table of Contents
          </div>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
            title="Close Table of Contents"
          >
            <svg
              className="w-5 h-5 text-gray-600"
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

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <nav>
            <div className="space-y-1">
              {tocItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`block w-full text-left py-3 px-3 rounded-lg transition-all duration-200 text-sm ${
                    activeId === item.id
                      ? "bg-blue-100 text-blue-800 font-medium border-l-3 border-blue-500"
                      : "text-gray-800 hover:bg-gray-50 hover:text-gray-900"
                  } ${
                    item.level === 1
                      ? "font-semibold text-base"
                      : item.level === 2
                      ? "ml-4"
                      : item.level === 3
                      ? "ml-8 text-gray-600"
                      : item.level === 4
                      ? "ml-12 text-gray-500 text-xs"
                      : item.level === 5
                      ? "ml-16 text-gray-500 text-xs"
                      : "ml-20 text-gray-500 text-xs"
                  }`}
                  title={item.text}
                >
                  {item.text}
                </button>
              ))}
            </div>
          </nav>
        </div>
      </div>

      {/* TOC Toggle Button - moves with drawer */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className={`fixed top-6 z-50 w-12 h-12 bg-white border border-gray-300 rounded-l-2xl shadow-lg flex items-center justify-center transition-all duration-300 focus:outline-none ${
          isMenuOpen ? "right-[380px]" : "right-0"
        }`}
        title="Table of Contents"
      >
        <svg
          className="w-5 h-5 text-gray-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 10h16M4 14h16M4 18h16"
          />
        </svg>
      </button>
    </>
  );
};
