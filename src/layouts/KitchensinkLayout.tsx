import React, { useState } from "react";
import {
  DocsProvider,
  DocsToggleButton,
  DocsDrawer,
  DocsComponentsList,
} from "../components/DocsMode";

interface KitchensinkLayoutProps {
  children: React.ReactNode;
}

export const KitchensinkLayout = ({ children }: KitchensinkLayoutProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <DocsProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
        {/* Backdrop for mobile menu */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsMenuOpen(false)}
          />
        )}

        {/* Floating Navigation Menu */}
        <div className="fixed left-6 top-6 z-50">
          {/* Expandable Menu Panel */}
          <div
            className={`absolute left-full top-0 ml-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl transform transition-all duration-300 ease-out ${
              isMenuOpen
                ? "translate-x-0 opacity-100"
                : "-translate-x-full opacity-0"
            }`}
          >
            <div className="py-4 px-6 min-w-48">
              <div className="text-white/60 text-xs font-medium uppercase tracking-wider mb-3">
                Navigation
              </div>
              <nav className="space-y-2">
                {/* Home Link */}
                <a
                  href="/"
                  className="flex items-center gap-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl px-3 py-2 transition-all duration-200 group/item"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center group-hover/item:from-blue-500/30 group-hover/item:to-purple-500/30 transition-all duration-200">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                  </div>
                  <span className="font-medium">Home</span>
                </a>

                {/* Members Link */}
                <a
                  href="/members"
                  className="flex items-center gap-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl px-3 py-2 transition-all duration-200 group/item"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-lg flex items-center justify-center group-hover/item:from-green-500/30 group-hover/item:to-blue-500/30 transition-all duration-200">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                      />
                    </svg>
                  </div>
                  <span className="font-medium">Members</span>
                </a>
              </nav>
            </div>
          </div>

          {/* Hamburger Toggle Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`w-12 h-12 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl flex items-center justify-center transition-all duration-300 hover:bg-white/20 ${
              isMenuOpen ? "opacity-60 scale-95" : "opacity-100 scale-100"
            }`}
          >
            <svg
              className="w-5 h-5 text-white/80"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Main Content */}
        {children}

        {/* Docs Mode Components */}
        <DocsToggleButton />
        <DocsComponentsList />
        <DocsDrawer />

        {/* Floating elements for visual appeal */}
        <div className="fixed top-20 left-20 w-20 h-20 bg-white/5 rounded-full blur-xl animate-pulse pointer-events-none" />
        <div className="fixed bottom-20 right-20 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl animate-pulse delay-700 pointer-events-none" />
        <div className="fixed top-1/2 left-10 w-16 h-16 bg-pink-500/10 rounded-full blur-xl animate-pulse delay-1000 pointer-events-none" />
      </div>
    </DocsProvider>
  );
};
