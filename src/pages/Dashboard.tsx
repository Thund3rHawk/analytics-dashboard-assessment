import { useState, useEffect, useMemo } from "react";
import { Zap, Car, MapPin, Activity, Filter, RefreshCw } from "lucide-react";
import Papa from "papaparse";
import Footer from "@/components/shared/Footer";
import VehicleDetailsCard from "@/components/shared/VehicleDetailsCard";
import PostalCodeCard from "@/components/shared/PostalCodeCard";
import YearDistributionCard from "@/components/shared/YearDistributionCard";
import ElectricDistributionCard from "@/components/shared/ElectricDistributionCard";
import VehicleDistributionCard from "@/components/shared/VehicleDistributionCard";
import DetailsCard from "@/components/shared/DetailsCard";
import LoadingPage from "./LoadingPage";

const Dashboard = () => {
  interface Vehicle {
    Make: string;
    Model: string;
    "Model Year": string;
    "Postal Code": string;
    "Electric Range": string;
    [key: string]: any;
  }

  const [data, setData] = useState<Vehicle[]>([]);
  const [filteredData, setFilteredData] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [filters, setFilters] = useState({
    make: "",
    model: "",
    year: "",
    postalCode: "",
    range: [0, 500],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 20;

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetch(
          "../../data-to-visualize/Electric_Vehicle_Population_Data.csv"
        );
        if (!data.ok) {
          throw new Error("failed to read file");
        }
        const csvText = await data.text();

        Papa.parse(csvText, {
          header: true,
          complete: (results: any) => {
            setData(results.data);
          },
        });
      } catch (error) {
        throw error;
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // Apply filters to data
  useEffect(() => {
    if (data.length > 0) {
      let results = [...data];

      if (filters.make) {
        results = results.filter((vehicle) => vehicle.Make === filters.make);
      }

      if (filters.model) {
        results = results.filter((vehicle) => vehicle.Model === filters.model);
      }

      if (filters.year) {
        results = results.filter(
          (vehicle) => vehicle["Model Year"] === filters.year
        );
      }

      if (filters.postalCode) {
        results = results.filter(
          (vehicle) => vehicle["Postal Code"] === filters.postalCode
        );
      }

      if (filters.range[0] > 0 || filters.range[1] < 500) {
        results = results.filter((vehicle) => {
          const range = parseInt(vehicle["Electric Range"]);
          return range >= filters.range[0] && range <= filters.range[1];
        });
      }

      setFilteredData(results);
      setCurrentPage(1);
    }
  }, [data, filters, searchQuery]);

  // Calculate statistics and chart data based on filtered data
  const stats = useMemo(() => {
    if (filteredData.length === 0)
      return { total: 0, avgRange: 0, topPostalCode: "", growthRate: 0 };

    // Calculate average range
    const totalRange = filteredData.reduce(
      // @ts-ignore
      (sum, vehicle) => sum + parseInt(vehicle["Electric Range"] || 0),
      0
    );
    const avgRange = Math.round(totalRange / filteredData.length);

    // Find top postal code
    const postalCodeCounts = {};
    filteredData.forEach((vehicle) => {
      const postalCode = vehicle["Postal Code"];
      // @ts-ignore
      postalCodeCounts[postalCode] = (postalCodeCounts[postalCode] || 0) + 1;
    });

    let topPostalCode = "";
    let maxCount = 0;
    Object.entries(postalCodeCounts).forEach(([code, count]) => {
      // @ts-ignore
      if (count > maxCount) {
        // @ts-ignore
        maxCount = count;
        topPostalCode = code;
      }
    });

    // For demo purposes: mocked growth rate
    // const growthRate = 27;
    // Count the most frequent year
    const yearCounts = {};
    filteredData.forEach((vehicle) => {
      const year = vehicle["Model Year"];
      //@ts-ignore
      yearCounts[year] = (yearCounts[year] || 0) + 1;
    });

    let mostFrequentYear = "";
    let maxYearCount = 0;
    Object.entries(yearCounts).forEach(([year, count]) => {
      //@ts-ignore
      if (count > maxYearCount) {
        //@ts-ignore
        maxYearCount = count;
        mostFrequentYear = year;
      }
    });

    // Mocked growth rate based on most frequent year

    return {
      total: filteredData.length,
      avgRange,
      topPostalCode,
      mostFrequentYear,
    };
  }, [filteredData]);

  // Calculate model distribution
  const modelDistribution = useMemo(() => {
    if (filteredData.length === 0) return [];

    const modelCounts: any = {};
    filteredData.forEach((vehicle) => {
      const model = `${vehicle.Make} ${vehicle.Model}`;
      modelCounts[model] = (modelCounts[model] || 0) + 1;
    });

    return (
      Object.entries(modelCounts)
        .map(([name, value]) => ({ name, value }))
        // @ts-ignore
        .sort((a, b) => b.value - a.value)
        .slice(0, 10)
    ); // Top 10 models
  }, [filteredData]);

  // Calculate range distribution
  const rangeDistribution = useMemo(() => {
    if (filteredData.length === 0) return [];

    const ranges = {
      "0-100": 0,
      "101-200": 0,
      "201-300": 0,
      "301-400": 0,
      "401+": 0,
    };

    filteredData.forEach((vehicle) => {
      const range = parseInt(vehicle["Electric Range"]);
      if (range <= 100) ranges["0-100"]++;
      else if (range <= 200) ranges["101-200"]++;
      else if (range <= 300) ranges["201-300"]++;
      else if (range <= 400) ranges["301-400"]++;
      else ranges["401+"]++;
    });

    return Object.entries(ranges).map(([range, count]) => ({ range, count }));
  }, [filteredData]);

  // Calculate year distribution
  const yearDistribution = useMemo(() => {
    if (filteredData.length === 0) return [];

    const yearCounts: any = {};
    filteredData.forEach((vehicle) => {
      const year = vehicle["Model Year"];
      yearCounts[year] = (yearCounts[year] || 0) + 1;
    });

    return (
      Object.entries(yearCounts)
        .map(([year, count]) => ({ year, count }))
        // @ts-ignore
        .sort((a, b) => a.year - b.year)
    );
  }, [filteredData]);

  // Calculate postal code distribution
  const postalCodeDistribution = useMemo(() => {
    if (filteredData.length === 0) return [];

    const postalCodeCounts: any = {};
    filteredData.forEach((vehicle) => {
      const postalCode = vehicle["Postal Code"];
      postalCodeCounts[postalCode] = (postalCodeCounts[postalCode] || 0) + 1;
    });

    return (
      Object.entries(postalCodeCounts)
        .map(([postalCode, count]) => ({ postalCode, count }))
        // @ts-ignore
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
    ); // Top 5 postal codes
  }, [filteredData]);

  // Paginated data for data table
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  // Total pages calculation
  const totalPages = useMemo(() => {
    return Math.ceil(filteredData.length / itemsPerPage);
  }, [filteredData]);

  // Handle filter changes
  const handleFilterChange = (filterName: string, value: number[]) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  // Handle vehicle selection
  const handleVehicleSelect = (vehicle: any) => {
    setSelectedVehicle(vehicle);
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      make: "",
      model: "",
      year: "",
      postalCode: "",
      range: [0, 500],
    });
    setSearchQuery("");
  };

  if (isLoading) {
    <LoadingPage />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#102E50] to-blue-800 text-white p-4 md:p-6 shadow-lg">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-0">
              Vehicle Dashboard
            </h1>
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center bg-[#F5C45E] text-black hover:bg-[#ebc77a] rounded-full px-4 py-2 w-full md:w-auto justify-center"
              >
                <Filter className="mr-2 h-4 w-4" />
                <span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
              </button>
              <button
                onClick={resetFilters}
                className="flex items-center bg-[#F5C45E] text-black hover:bg-[#ebc77a] rounded-full px-4 py-2 w-full md:w-auto justify-center"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 bg-[#102E50] rounded-lg p-4 grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-blue-200 text-sm mb-1">Make</label>
                <select
                  value={filters.make}
                  onChange={(e: any) =>
                    handleFilterChange("make", e.target.value)
                  }
                  className="bg-blue-800 text-white rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <option value="">All Makes</option>
                  <option value="TESLA">Tesla</option>
                  <option value="NISSAN">Nissan</option>
                  <option value="CHEVROLET">Chevrolet</option>
                  <option value="BMW">BMW</option>
                  <option value="FORD">Ford</option>
                </select>
              </div>
              <div>
                <label className="block text-blue-200 text-sm mb-1">
                  Model
                </label>
                <select
                  value={filters.model}
                  onChange={(e: any) =>
                    handleFilterChange("model", e.target.value)
                  }
                  className="bg-blue-800 text-white rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <option value="">All Models</option>
                  <option value="MODEL Y">Model Y</option>
                  <option value="MODEL 3">Model 3</option>
                  <option value="MODEL S">Model S</option>
                  <option value="MODEL X">Model X</option>
                  <option value="LEAF">Leaf</option>
                </select>
              </div>
              <div>
                <label className="block text-blue-200 text-sm mb-1">Year</label>
                <select
                  value={filters.year}
                  onChange={(e: any) =>
                    handleFilterChange("year", e.target.value)
                  }
                  className="bg-blue-800 text-white rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <option value="">All Years</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                  <option value="2020">2020</option>
                </select>
              </div>
              <div>
                <label className="block text-blue-200 text-sm mb-1">
                  Postal Code
                </label>
                <select
                  value={filters.postalCode}
                  onChange={(e: any) =>
                    handleFilterChange("postalCode", e.target.value)
                  }
                  className="bg-blue-800 text-white rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <option value="">All Postal Codes</option>
                  <option value="98122">98122</option>
                  <option value="98103">98103</option>
                  <option value="98105">98105</option>
                  <option value="98107">98107</option>
                  <option value="98112">98112</option>
                </select>
              </div>
              <div>
                <label className="block text-blue-200 text-sm mb-1">
                  Electric Range: {filters.range[0]} - {filters.range[1]} miles
                </label>
                <div className="flex space-x-4">
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={filters.range[0]}
                    onChange={(e) =>
                      handleFilterChange("range", [
                        parseInt(e.target.value),
                        filters.range[1],
                      ])
                    }
                    className="w-full"
                  />
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={filters.range[1]}
                    onChange={(e) =>
                      handleFilterChange("range", [
                        filters.range[0],
                        parseInt(e.target.value),
                      ])
                    }
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="container mx-auto p-4 md:p-6">
        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
          <DetailsCard
            icon={<Zap className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />}
            heading="Avg. Electric Range"
            color="bg-blue-100"
            about={`${stats.total.toLocaleString()}`}
          />

          <DetailsCard
            icon={<Car className="h-6 w-6 md:h-8 md:w-8 text-green-600" />}
            heading="Total EVs"
            color="bg-green-100"
            about={`${stats.avgRange} mi`}
          />

          <DetailsCard
            icon={<MapPin className="h-6 w-6 md:h-8 md:w-8 text-purple-600" />}
            heading="Top Postal Code"
            color="bg-purple-100"
            about={`${stats.topPostalCode}`}
          />

          <DetailsCard
            icon={
              <Activity className="h-6 w-6 md:h-8 md:w-8 text-yellow-600" />
            }
            heading="Most Frequent Year"
            color="bg-yellow-100"
            about={`${stats.mostFrequentYear}`}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
          {/* Vehicle Distribution Chart */}
          <VehicleDistributionCard modelDistribution={modelDistribution} />

          {/* Electric Range Distribution */}
          <ElectricDistributionCard rangeDistribution={rangeDistribution} />
        </div>

        {/* Second row of charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
          {/* Year Distribution */}
          <YearDistributionCard yearDistribution={yearDistribution} />

          {/* Postal Code Distribution */}
          <PostalCodeCard postalCodeDistribution={postalCodeDistribution} />
        </div>

        {/* Data Table and Vehicle Detail Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-white rounded-xl shadow-md p-4 md:p-6 lg:col-span-2 overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Vehicle Data</h2>
              <div className="text-sm text-gray-500">
                Showing {paginatedData.length} of {filteredData.length} vehicles
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Make & Model
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Year
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Range (mi)
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Location
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedData.map((vehicle, index) => (
                    <tr
                      key={index}
                      className={
                        // @ts-ignore
                        selectedVehicle && selectedVehicle.id === vehicle.id
                          ? "bg-blue-50"
                          : "hover:bg-gray-50"
                      }
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {vehicle.Make}
                            </div>
                            <div className="text-sm text-gray-500">
                              {vehicle.Model}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {vehicle["Model Year"]}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {vehicle["Electric Range"]}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {vehicle.City}
                        </div>
                        <div className="text-sm text-gray-500">
                          {vehicle["Postal Code"]}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleVehicleSelect(vehicle)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 mt-4">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
                    currentPage === 1
                      ? "text-gray-300"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
                    currentPage === totalPages
                      ? "text-gray-300"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">
                      {(currentPage - 1) * itemsPerPage + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(
                        currentPage * itemsPerPage,
                        filteredData.length
                      )}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">{filteredData.length}</span>{" "}
                    results
                  </p>
                </div>
                <div>
                  <nav
                    className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium ${
                        currentPage === 1
                          ? "text-gray-300"
                          : "text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      <span className="sr-only">Previous</span>←
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNumber;
                      if (totalPages <= 5) {
                        pageNumber = i + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i;
                      } else {
                        pageNumber = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => setCurrentPage(pageNumber)}
                          className={`relative inline-flex items-center border px-4 py-2 text-sm font-medium ${
                            currentPage === pageNumber
                              ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium ${
                        currentPage === totalPages
                          ? "text-gray-300"
                          : "text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      <span className="sr-only">Next</span>→
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Details Panel */}
          <VehicleDetailsCard selectedVehicle={selectedVehicle} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
