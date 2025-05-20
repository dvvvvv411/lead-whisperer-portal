
import { Link } from "react-router-dom";

const AdminLogo = () => {
  return (
    <Link to="/admin" className="flex items-center">
      <img 
        src="https://i.imgur.com/Q191f5z.png" 
        alt="KRYPTO AI Logo" 
        className="h-10 object-contain mr-2" 
      />
    </Link>
  );
};

export default AdminLogo;
