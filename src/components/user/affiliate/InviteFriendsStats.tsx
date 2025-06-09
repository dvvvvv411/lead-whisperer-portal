
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Gift } from 'lucide-react';

interface InviteFriendsStatsProps {
  totalInvitations: number;
  paidBonuses: number;
  pendingBonuses: number;
  totalEarned: number;
}

const InviteFriendsStats = ({ 
  totalInvitations, 
  paidBonuses, 
  pendingBonuses, 
  totalEarned 
}: InviteFriendsStatsProps) => {
  const statsCards = [
    {
      icon: Users,
      label: "Einladungen",
      value: totalInvitations,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      delay: 0,
    },
    {
      icon: Gift,
      label: "Verdient",
      value: `€${totalEarned}`,
      color: "text-gold",
      bgColor: "bg-gold/10",
      delay: 0.1,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      {statsCards.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: stat.delay }}
        >
          <Card className="neo-glass border-gold/20 hover:border-gold/40 transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400">{stat.label}</p>
                  <p className="text-xl font-bold text-white">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default InviteFriendsStats;
