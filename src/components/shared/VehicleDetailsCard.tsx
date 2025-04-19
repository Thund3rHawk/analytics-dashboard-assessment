import { AlertCircle, Map } from "lucide-react";

const VehicleDetailsCard = ({ selectedVehicle }: any) => {
  return (
    <>
      <div className="bg-white rounded-xl shadow-md p-4 md:p-6 ">
        <h2 className="text-lg font-bold mb-4">Vehicle Details</h2>
        {selectedVehicle ? (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-700">Make/Model</span>
                <span className="font-bold">
                  {selectedVehicle.Make} {selectedVehicle.Model}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-700">Year</span>
                <span>{selectedVehicle["Model Year"]}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-700">
                  Electric Range
                </span>
                <span>{selectedVehicle["Electric Range"]} miles</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-700">Type</span>
                <span>{selectedVehicle["Electric Vehicle Type"]}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">CAFV Eligible</span>
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                  Yes
                </span>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-700">City</span>
                <span>{selectedVehicle.City}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-700">Postal Code</span>
                <span>{selectedVehicle["Postal Code"]}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-700">County</span>
                <span>{selectedVehicle.County}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">
                  Legislative District
                </span>
                <span>{selectedVehicle["Legislative District"]}</span>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-700">
                  DOL Vehicle ID
                </span>
                <span>{selectedVehicle["DOL Vehicle ID"]}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-700">VIN (1-10)</span>
                <span>{selectedVehicle["VIN (1-10)"]}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-700">
                  Electric Utility
                </span>
                <span className="text-xs text-gray-700">
                  {selectedVehicle["Electric Utility"]}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Census Tract</span>
                <span>{selectedVehicle["2020 Census Tract"]}</span>
              </div>
            </div>

            {/* Location Data */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-2">
                Vehicle Location
              </h3>
              <div className="h-48 bg-blue-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-50"></div>
                <div className="relative z-10 text-center">
                  <Map className="h-10 w-10 text-white mx-auto mb-2" />
                  <p className="text-white font-medium">
                    {selectedVehicle["Vehicle Location"]}
                  </p>
                  <p className="text-blue-100 text-sm mt-1">
                    {selectedVehicle.City}, {selectedVehicle.State}{" "}
                    {selectedVehicle["Postal Code"]}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <AlertCircle className="h-12 w-12 mb-4" />
            <p>Select a vehicle to view details</p>
          </div>
        )}
      </div>
    </>
  );
};

export default VehicleDetailsCard;
