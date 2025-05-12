
import { Link } from "react-router-dom";
import { CircleDollarSign } from "lucide-react";

const UserNavbarLogo = () => {
  return (
    <div className="flex items-center">
      <Link to="/nutzer" className="flex items-center">
        <CircleDollarSign className="h-6 w-6 mr-2 text-gold" />
        <span className="text-xl font-bold gradient-text">Crypto Trader</span>
      </Link>
    </div>
  );
};

export default UserNavbarLogo;
