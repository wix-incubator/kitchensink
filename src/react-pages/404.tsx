import { KitchensinkLayout } from "../layouts/KitchensinkLayout";

export default function NotFoundPage() {
  return (
    <KitchensinkLayout>
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-white/20 mb-4">404</h1>
            <h2 className="text-4xl font-bold text-white mb-4">
              Page Not Found
            </h2>
            <p className="text-xl text-white/70 mb-8">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <div className="space-y-4">
            <a
              href="/"
              className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              Go Home
            </a>

            <div className="flex justify-center space-x-4 text-white/60">
              <a href="/store" className="hover:text-white transition-colors">
                Store
              </a>
              <span>•</span>
              <a
                href="/bookings"
                className="hover:text-white transition-colors"
              >
                Bookings
              </a>
              <span>•</span>
              <a href="/members" className="hover:text-white transition-colors">
                Members
              </a>
            </div>
          </div>
        </div>
      </div>
    </KitchensinkLayout>
  );
}
