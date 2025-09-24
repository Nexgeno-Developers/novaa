export default function Loading() {
  return (
    <main className="relative min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center space-y-4">
        {/* Loader spinner */}
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-primary"></div>

        {/* Text */}
        <p className="text-gray-600 text-lg">Loading project details...</p>
      </div>
    </main>
  );
}