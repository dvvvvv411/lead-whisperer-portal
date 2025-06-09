
import { motion } from 'framer-motion';
import { useAffiliate } from '@/hooks/useAffiliate';
import InviteFriendsHeader from './InviteFriendsHeader';
import InviteFriendsContent from './InviteFriendsContent';

const InviteFriendsTab = () => {
  const { affiliateCode, invitations, copyAffiliateLink, error } = useAffiliate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-casino-darker via-casino-dark to-casino-darker">
      {/* Debug Info (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-gray-800 p-4 rounded-lg text-sm text-gray-300 mb-6">
          <strong>Debug Info:</strong><br />
          Affiliate Code: {affiliateCode ? affiliateCode.code : 'Loading...'}<br />
          Error: {error || 'None'}
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left Column - Header/Hero Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:sticky lg:top-8"
          >
            <div className="bg-gradient-to-br from-casino-card to-casino-card/50 backdrop-blur-xl border border-gold/20 rounded-2xl min-h-[500px]">
              <InviteFriendsHeader />
            </div>
          </motion.div>

          {/* Right Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-br from-casino-card to-casino-card/50 backdrop-blur-xl border border-gold/20 rounded-2xl p-6">
              <InviteFriendsContent
                affiliateCode={affiliateCode}
                invitations={invitations}
                copyAffiliateLink={copyAffiliateLink}
                error={error}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default InviteFriendsTab;
