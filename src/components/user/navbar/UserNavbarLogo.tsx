
import { Link } from "react-router-dom";

const UserNavbarLogo = () => {
  return (
    <div className="flex items-center">
      <Link to="/nutzer" className="flex items-center">
        <img 
          src="https://i.imgur.com/UA0DBN4.png" 
          alt="KRYPTO AI Logo" 
          className="h-8 object-contain" 
        />
      </Link>
    </div>
  );
};

export default UserNavbarLogo;
