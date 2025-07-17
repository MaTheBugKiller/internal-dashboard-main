export const FeedbackRatings = ({ 
  title,
  data 
}: { 
  title: string;
  data: {
    averageRating: number;
    total5s: number;
    total4s: number;
    total3s: number;
    total2s: number;
    total1s: number;
    totalCount: number;
  }
}) => {
  if (!data) return null;
  
  // Create an array of rating distributions for easier mapping
  const ratingDistribution = [
    { stars: 5, count: data.total5s },
    { stars: 4, count: data.total4s },
    { stars: 3, count: data.total3s },
    { stars: 2, count: data.total2s },
    { stars: 1, count: data.total1s }
  ];

  // Calculate percentage for bar widths
  const totalRatings = data.totalCount;

  // Color mapping for different star ratings
  const getBarColor = (stars: number) => {
    switch(stars) {
      case 5:
      case 4:  
      case 3: return 'bg-teal-600';
      case 2: return 'bg-yellow-500';
      case 1: return 'bg-red-400';
      default: return 'bg-gray-200';
    }
  };

  return (
    <div className="w-full max-w-md p-4 font-sans">
      <h3 className="text-xl font-medium text-gray-700 mb-4">{title}</h3>
      <div className="flex">
        <div className="md:w-2/5 md:pr-4 flex flex-col items-center">
          <div className="text-5xl  text-gray-800">{data.averageRating.toFixed(1)}<span className="text-teal-600 text-3xl">★</span></div>
          <div className="text-sm text-gray-500 mt-2">{`{ ${data.totalCount} total feedbacks }`}</div>
        </div>

        <div className="w-2/3 hidden md:flex flex-col justify-center">
          {ratingDistribution.map((item) => (
            <div key={item.stars} className="flex items-center mb-2">
              <div className="w-12  text-right pr-2"><span className="font-bold">{item.stars}</span> ★</div>
              <div className="flex-1 h-2 bg-gray-200  overflow-hidden">
                <div 
                  className={`h-full ${getBarColor(item.stars)}`} 
                  style={{ width: totalRatings > 0 ? `${(item.count / totalRatings) * 100}%` : '0%' }}>
                </div>
              </div>
              <div className="w-16  pl-2 text-gray-600">{item.count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};