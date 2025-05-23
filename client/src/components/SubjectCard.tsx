import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface Subject {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
}

interface SubjectCardProps {
  subject: Subject;
  showProgress?: boolean;
  className?: string;
}

export default function SubjectCard({ subject, showProgress = false, className }: SubjectCardProps) {
  // Mock progress data - in real app this would come from props or query
  const progress = Math.floor(Math.random() * 100);
  const completedLessons = Math.floor(Math.random() * 15);
  const totalLessons = 20;
  
  const getSubjectIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'mathematics':
      case 'math':
        return '🧮';
      case 'science':
        return '🔬';
      case 'english':
        return '📚';
      case 'history':
        return '🏛️';
      default:
        return '📖';
    }
  };

  const getSubjectColor = (color?: string) => {
    switch (color) {
      case 'blue':
        return 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700/50';
      case 'green':
        return 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700/50';
      case 'purple':
        return 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700/50';
      case 'orange':
        return 'from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700/50';
      default:
        return 'from-slate-50 to-slate-100 dark:from-slate-900/20 dark:to-slate-800/20 border-slate-200 dark:border-slate-700/50';
    }
  };

  const getIconColor = (color?: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-500';
      case 'green':
        return 'bg-green-500';
      case 'purple':
        return 'bg-purple-500';
      case 'orange':
        return 'bg-orange-500';
      default:
        return 'bg-primary';
    }
  };

  return (
    <Card className={cn(
      `bg-gradient-to-br ${getSubjectColor(subject.color)} rounded-2xl border hover:shadow-lg transition-all cursor-pointer group hover:scale-105`,
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 ${getIconColor(subject.color)} rounded-xl flex items-center justify-center group-hover:animate-bounce`}>
            <span className="text-white text-xl">
              {getSubjectIcon(subject.name)}
            </span>
          </div>
          {showProgress && (
            <Badge variant="secondary" className="text-xs">
              {progress}%
            </Badge>
          )}
        </div>
        
        <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
          {subject.name}
        </h4>
        
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
          {subject.description || `Learn about ${subject.name.toLowerCase()}`}
        </p>

        {showProgress && (
          <div className="space-y-3">
            <Progress value={progress} className="h-2" />
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>{completedLessons}/{totalLessons} lessons</span>
              <Button size="sm" className="btn-primary h-8 text-xs">
                <Play className="w-3 h-3 mr-1" />
                Continue
              </Button>
            </div>
          </div>
        )}

        {!showProgress && (
          <Button size="sm" className="w-full btn-primary">
            <Play className="w-4 h-4 mr-2" />
            Start Learning
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
