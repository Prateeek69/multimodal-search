interface Props {
  results: string[];
  onSelectImage: (image: string) => void;
}

const ResultsGrid = ({ results, onSelectImage }: Props) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
      {results.map((img, i) => (
        <div
          key={i}
          onClick={() => onSelectImage(img)}
          className="rounded-xl overflow-hidden bg-white/5 hover:scale-105 transition-all duration-300 shadow-lg cursor-pointer border border-white/10"
        >
          <img
            src={`http://127.0.0.1:8000/${img.replace("dataset/", "")}`}
            className="w-full h-48 object-cover"
            alt={`Result ${i}`}
          />
        </div>
      ))}
    </div>
  );
};

export default ResultsGrid;