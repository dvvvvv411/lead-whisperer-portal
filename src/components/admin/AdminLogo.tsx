
import { Link } from "react-router-dom";

const AdminLogo = () => {
  return (
    <Link to="/admin" className="flex items-center">
      <img 
        src="https://i.imgur.com/UA0DBN4.png" 
        alt="KRYPTO AI Logo" 
        className="h-8 object-contain mr-2" 
      />
    </Link>
  );
};

export default AdminLogo;
