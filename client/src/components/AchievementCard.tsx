import { Badge } from "@/components/ui/badge";
import { Star, Award, Trophy } from "lucide-react";

interface Achievement {
  id: string;
  name: string;
  description: string;
  xpReward: number;
  icon?: string;
}

interface AchievementCardProps {
  achievement: {
    achievement: Achievement;
    earnedAt: string;
  };
}

export default function AchievementCard({ achievement }: AchievementCardProps) {
  const getAchievementIcon = (name: string) => {
    if (name.toLowerCase().includes('science')) return <Star className="text-white" />;
    if (name.toLowerCase().includes('math')) return <Trophy className="text-white" />;
    return <Award className="text-white" />;
  };

  const getAchievementGradient = (name: string) => {
    if (name.toLowerCase().includes('science')) return 'from-accent to-warning';
    if (name.toLowerCase().includes('math')) return 'from-success to-emerald-400';
    return 'from-primary to-secondary';
  };

  return (
    <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-accent/10 to-warning/10 rounded-xl">
      <div className={`w-10 h-10 bg-gradient-to-r ${getAchievementGradient(achievement.achievement.name)} rounded-full flex items-center justify-center animate-pulse-slow`}>
        {getAchievementIcon(achievement.achievement.name)}
      </div>
      <div className="flex-1">
        <p className="font-medium text-slate-900 dark:text-white text-sm">
          {achievement.achievement.name}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {achievement.achievement.description}
        </p>
        <Badge variant="secondary" className="mt-1 text-xs">
          +{achievement.achievement.xpReward} XP
        </Badge>
      </div>
    </div>
  );
}
