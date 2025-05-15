
import { useState } from "react";
import { Link } from "react-router-dom";

const UserNavbarLogo = () => {
  const [imageError, setImageError] = useState(false);
  
  const handleImageError = () => {
    console.error("Logo image failed to load in UserNavbarLogo");
    setImageError(true);
  };
  
  return (
    <div className="flex items-center">
      <Link to="/nutzer" className="flex items-center">
        {imageError ? (
          <div className="bg-gold/20 text-gold font-bold rounded p-2 h-10 flex items-center justify-center">
            KRYPTO AI
          </div>
        ) : (
          <img 
            src="https://i.imgur.com/Q191f5z.png" 
            alt="KRYPTO AI Logo" 
            className="h-10 object-contain"
            onError={handleImageError}
          />
        )}
      </Link>
    </div>
  );
};

export default UserNavbarLogo;
