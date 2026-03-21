const Loader = () => (
  <div className="flex justify-center items-center py-10">
    <div className="flex flex-col items-center gap-3">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-white text-sm">Searching...</p>
    </div>
  </div>
);
export default Loader;