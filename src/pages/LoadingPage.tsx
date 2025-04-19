const LoadingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-lg">Loading dashboard data...</p>
        <p className="text-sm text-gray-500">
          Processing 50,000 vehicle records
        </p>
      </div>
    </div>
  );
};

export default LoadingPage;
