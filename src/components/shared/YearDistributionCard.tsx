import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const YearDistributionCard = ({yearDistribution}: any) => {
  return (
    <>
      <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
        <h2 className="text-lg font-bold mb-4">Vehicles by Year</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={yearDistribution}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip formatter={(value) => [value, "Vehicles"]} />
              <Legend />
              <Area
                type="monotone"
                dataKey="count"
                name="Vehicles"
                fill="#0088FE"
                stroke="#0088FE"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

export default YearDistributionCard;
