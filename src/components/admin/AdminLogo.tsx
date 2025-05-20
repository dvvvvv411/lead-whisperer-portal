
import { Link } from "react-router-dom";
import DynamicLogo from "@/components/common/DynamicLogo";

const AdminLogo = () => {
  return (
    <Link to="/admin" className="flex items-center">
      <DynamicLogo height={10} className="mr-2" />
    </Link>
  );
};

export default AdminLogo;
