
import { Link } from "react-router-dom";

const UserNavbarLogo = () => {
  return (
    <div className="flex items-center">
      <Link to="/nutzer" className="flex items-center">
        <img 
          src="https://i.imgur.com/oXGr0DY.png" 
          alt="bitbamba Logo" 
          className="h-10 object-contain" 
        />
      </Link>
    </div>
  );
};

export default UserNavbarLogo;
