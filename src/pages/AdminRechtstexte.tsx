
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminRechtstexte = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the new rebranding page
    navigate("/admin/rebranding");
  }, [navigate]);
  
  return null;
};

export default AdminRechtstexte;
