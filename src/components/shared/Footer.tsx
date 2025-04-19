const Footer = () => {
  return (
      <footer className="bg-gray-800 text-white p-4 md:p-6 mt-8">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm mb-4 md:mb-0">
            <p>© 2025 Electric Vehicle Registry Dashboard</p>
            <p className="text-gray-400">
              Data source: WA State Department of Licensing
            </p>
          </div>
          <div className="flex space-x-4">
            <p>Designed by Swadhin Paul</p>
          </div>
        </div>
      </footer>
  );
};

export default Footer;
