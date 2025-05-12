
export const getRankBadgeBg = (rank: number) => {
  switch(rank) {
    case 1: return "bg-gradient-to-br from-amber-700 to-amber-500"; // Bronze
    case 2: return "bg-gradient-to-br from-slate-400 to-slate-300"; // Silver
    case 3: return "bg-gradient-to-br from-yellow-500 to-amber-300"; // Gold
    case 4: return "bg-gradient-to-br from-blue-600 to-cyan-400"; // Platinum
    case 5: return "bg-gradient-to-br from-violet-600 to-fuchsia-400"; // Diamond
    default: return "bg-slate-700";
  }
};

export const getRankGlow = (rank: number) => {
  switch(rank) {
    case 1: return "shadow-amber-700/30"; // Bronze
    case 2: return "shadow-slate-400/30"; // Silver
    case 3: return "shadow-yellow-500/40"; // Gold
    case 4: return "shadow-blue-600/40"; // Platinum
    case 5: return "shadow-violet-600/50"; // Diamond
    default: return "shadow-slate-700/30";
  }
};
