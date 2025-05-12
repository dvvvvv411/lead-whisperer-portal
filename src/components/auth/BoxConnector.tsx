
const BoxConnector = () => {
  return (
    <div className="hidden md:flex flex-col items-center justify-center">
      <div className="w-1 h-24 bg-gradient-to-b from-gold/0 via-gold/30 to-gold/0"></div>
      <div className="w-6 h-6 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-gold animate-pulse"></div>
      </div>
      <div className="w-1 h-24 bg-gradient-to-b from-gold/0 via-gold/30 to-gold/0"></div>
    </div>
  );
};

export default BoxConnector;
