import { useState } from "react";

interface Props {
  onSearch: (query: string) => void;
  loading: boolean;
}

const SearchBar = ({ onSearch, loading }: Props) => {
  const [input, setInput] = useState("");

  const handleSearch = () => {
    if (!input.trim()) return;
    onSearch(input.trim());
  };

  return (
    <div className="flex gap-3 flex-col sm:flex-row items-center w-full max-w-3xl mx-auto">
      <input
        type="text"
        placeholder="Search for images..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSearch();
          }
        }}
        className="w-full px-5 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
      />

      <button
        onClick={handleSearch}
        disabled={loading}
        className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:scale-105 hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Searching..." : "Search"}
      </button>
    </div>
  );
};

export default SearchBar;