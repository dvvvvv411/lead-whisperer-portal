
import UserAuthWrapper from "@/components/user/auth/UserAuthWrapper";
import { UserNavbar } from "@/components/user/UserNavbar";
import AffiliateOverview from "@/components/user/affiliate/AffiliateOverview";
import { motion } from "framer-motion";

const UserAffiliate = () => {
  return (
    <UserAuthWrapper redirectTo="/auth" minCredit={250}>
      {(user) => (
        <div className="min-h-screen bg-casino-darker text-gray-300">
          <UserNavbar userId={user.id} userEmail={user.email} />
          
          <div className="container mx-auto p-4">
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gold via-yellow-400 to-gold bg-clip-text text-transparent">
                Freunde einladen
              </h1>
              <p className="text-gray-400 mt-2">
                Laden Sie Freunde ein und verdienen Sie 50€ für jede erfolgreiche Aktivierung
              </p>
            </motion.div>
            
            <AffiliateOverview userId={user.id} />
          </div>
        </div>
      )}
    </UserAuthWrapper>
  );
};

export default UserAffiliate;
