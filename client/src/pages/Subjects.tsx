import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import VoiceAssistant from "@/components/VoiceAssistant";
import SubjectCard from "@/components/SubjectCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Play, Trophy } from "lucide-react";

export default function Subjects() {
  const { data: subjects = [] } = useQuery({
    queryKey: ['/api/subjects'],
  });

  const { data: progress } = useQuery({
    queryKey: ['/api/progress'],
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 lg:pb-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl text-slate-900 dark:text-white mb-2">
            Your Learning Universe
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Explore subjects and continue your educational journey
          </p>
        </div>

        {/* Overall Progress */}
        <Card className="card-kid mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Overall Progress</h3>
              <div className="flex items-center space-x-2 text-accent">
                <Trophy className="w-5 h-5" />
                <span className="font-semibold">{progress?.totalXP || 0} XP</span>
              </div>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {progress?.completedLessons || 0}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Lessons Completed
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-success mb-1">
                  {progress?.totalLessons || 0}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Total Lessons
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary mb-1">
                  {progress?.subjectProgress?.length || 0}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Active Subjects
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-accent mb-1">
                  {Math.round(((progress?.completedLessons || 0) / Math.max(progress?.totalLessons || 1, 1)) * 100)}%
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Overall Progress
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subjects Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {subjects.map((subject: any) => (
            <SubjectCard 
              key={subject.id} 
              subject={subject} 
              showProgress={true}
              className="h-full"
            />
          ))}
        </div>

        {/* Subject Progress Details */}
        {progress?.subjectProgress && progress.subjectProgress.length > 0 && (
          <Card className="card-kid">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Subject Progress</h3>
              
              <div className="space-y-6">
                {progress.subjectProgress.map((subjectProgress: any) => (
                  <div key={subjectProgress.subjectId} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-white">
                            {subjectProgress.subjectName}
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {subjectProgress.completedLessons} of {subjectProgress.totalLessons} lessons
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">
                          {Math.round(subjectProgress.progress)}%
                        </div>
                        <Button size="sm" className="btn-primary mt-1">
                          <Play className="w-4 h-4 mr-1" />
                          Continue
                        </Button>
                      </div>
                    </div>
                    
                    <Progress value={subjectProgress.progress} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {subjects.length === 0 && (
          <Card className="card-kid">
            <CardContent className="p-12 text-center">
              <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                No Subjects Available
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Subjects will appear here as they become available for your grade level.
              </p>
              <Button className="btn-primary">
                Explore Learning Paths
              </Button>
            </CardContent>
          </Card>
        )}
      </main>

      <BottomNavigation />
      <VoiceAssistant />
    </div>
  );
}
