const Header = () => {
  return (
    <div className="text-center mb-10">
      <p className="text-sm uppercase tracking-widest text-gray-400 mb-2">AI Powered Multimodal Search</p>
      <h1 className="text-4xl md:text-6xl font-extrabold leading-normal pb-3 bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 bg-clip-text text-transparent">
        Multimodal AI Image Search
      </h1>
      <p className="text-gray-300 mt-4 text-lg max-w-2xl mx-auto">
        Discover images with text, voice, or by uploading a sample — intelligent results in seconds.
      </p>
    </div>
  );
};

export default Header;