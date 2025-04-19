const DetailsCard = ({ icon, heading, about, color }: any) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 md:p-6 flex items-center">
      <div className={`rounded-full ${color} p-3 mr-4`}>{icon}</div>
      <div>
        <p className="text-gray-500 text-sm">{heading}</p>
        <p className="text-xl md:text-2xl font-bold">{about}</p>
      </div>
    </div>
  );
};

export default DetailsCard;
