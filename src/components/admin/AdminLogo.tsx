
import { Link } from "react-router-dom";

const AdminLogo = () => {
  return (
    <Link to="/admin" className="flex items-center">
      <img 
        src="https://i.imgur.com/oXGr0DY.png" 
        alt="bitbamba Logo" 
        className="h-10 object-contain mr-2" 
      />
    </Link>
  );
};

export default AdminLogo;
