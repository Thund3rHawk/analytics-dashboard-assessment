import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const ElectricDistributionCard = ({ rangeDistribution }: any) => {
  return (
    <>
      <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
        <h2 className="text-lg font-bold mb-4">Electric Range Distribution</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={rangeDistribution}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip formatter={(value) => [value, "Vehicles"]} />
              <Legend />
              <Bar dataKey="count" name="Vehicles" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

export default ElectricDistributionCard;
