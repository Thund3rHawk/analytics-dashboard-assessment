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

const PostalCodeCard = ({ postalCodeDistribution }: any) => {
  return (
    <>
      <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
        <h2 className="text-lg font-bold mb-4">Top Postal Codes</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={postalCodeDistribution}
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="postalCode" type="category" />
              <Tooltip formatter={(value) => [value, "Vehicles"]} />
              <Legend />
              <Bar dataKey="count" name="Vehicles" fill="#5F99AE" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

export default PostalCodeCard;
