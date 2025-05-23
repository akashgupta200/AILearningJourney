import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/components/ThemeProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Rocket, Star, Moon, Sun } from "lucide-react";

export default function Header() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-slate-800 shadow-lg border-b-4 border-primary sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center animate-glow">
              <Rocket className="text-white text-lg" />
            </div>
            <h1 className="font-display text-2xl text-primary dark:text-white">EduVerse</h1>
          </div>

          {/* User Info */}
          <div className="flex items-center space-x-4">
            {/* XP Display */}
            <div className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-accent to-warning px-4 py-2 rounded-full">
              <Star className="text-white w-4 h-4" />
              <span className="text-white font-semibold">{user?.xpPoints || 0} XP</span>
            </div>

            {/* User Avatar */}
            <div className="relative">
              <Avatar className="w-10 h-10 border-2 border-primary cursor-pointer hover:scale-110 transition-transform">
                <AvatarImage src={user?.profileImageUrl} />
                <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white font-semibold">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-white animate-pulse"></div>
            </div>

            {/* Dark Mode Toggle */}
            <Button
              onClick={toggleTheme}
              variant="ghost"
              size="icon"
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-yellow-400" />
              ) : (
                <Moon className="h-4 w-4 text-slate-600" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
