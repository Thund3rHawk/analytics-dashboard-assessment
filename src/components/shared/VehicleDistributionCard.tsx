import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const VehicleDistributionCard = ({ modelDistribution }: any) => {
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#4CAF50",
    "#9C27B0",
  ];
  return (
    <>
      <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
        <h2 className="text-lg font-bold mb-4">EV Model Distribution</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={modelDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name.split(" ")[1]}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {modelDistribution.map((entry: any, index: any) => (
                  <Cell key={entry} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value, "Vehicles"]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

export default VehicleDistributionCard;
