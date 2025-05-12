
import { Link } from "react-router-dom";

const UserNavbarLogo = () => {
  return (
    <div className="flex items-center">
      <Link to="/nutzer" className="flex items-center">
        <img 
          src="https://i.imgur.com/Q191f5z.png" 
          alt="KRYPTO AI Logo" 
          className="h-10 object-contain" 
        />
      </Link>
    </div>
  );
};

export default UserNavbarLogo;
