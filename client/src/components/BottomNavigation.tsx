import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  BookOpen, 
  Brain, 
  TrendingUp, 
  User 
} from "lucide-react";

export default function BottomNavigation() {
  const [location, setLocation] = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: BookOpen, label: "Subjects", path: "/subjects" },
    { icon: Brain, label: "AI Tutor", path: "/ai-tutor" },
    { icon: TrendingUp, label: "Progress", path: "/progress" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 lg:hidden z-40">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          
          return (
            <Button
              key={item.path}
              variant="ghost"
              onClick={() => setLocation(item.path)}
              className={`flex flex-col items-center justify-center space-y-1 h-full rounded-none transition-colors ${
                isActive 
                  ? 'text-primary bg-primary/10' 
                  : 'text-slate-400 hover:text-primary hover:bg-primary/5'
              }`}
            >
              <Icon className="text-lg w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
