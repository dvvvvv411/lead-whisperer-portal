
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { BarChart3, Settings, CreditCard, TrendingUp, Users } from "lucide-react";

const MobileNavigation = () => {
  const navItems = [
    { to: "/nutzer", label: "Dashboard", icon: BarChart3 },
    { to: "/nutzer/einzahlung", label: "Einzahlung", icon: CreditCard },
    { to: "/nutzer/auszahlung", label: "Auszahlung", icon: TrendingUp },
    { to: "/nutzer/freunde-einladen", label: "Freunde einladen", icon: Users },
    { to: "/nutzer/einstellungen", label: "Einstellungen", icon: Settings },
  ];

  return (
    <nav className="md:hidden mt-4 border-t border-gold/30 pt-4">
      <div className="grid grid-cols-2 gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center space-y-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                  isActive
                    ? "bg-gold/20 text-gold"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                )
              }
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNavigation;
