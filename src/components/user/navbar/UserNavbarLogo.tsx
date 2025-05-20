
import { Link } from "react-router-dom";
import DynamicLogo from "@/components/common/DynamicLogo";

const UserNavbarLogo = () => {
  return (
    <div className="flex items-center">
      <Link to="/nutzer" className="flex items-center">
        <DynamicLogo height={10} />
      </Link>
    </div>
  );
};

export default UserNavbarLogo;
