import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import VoiceAssistant from "@/components/VoiceAssistant";
import ProgressRing from "@/components/ProgressRing";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Clock, 
  Target, 
  Trophy, 
  Star, 
  BookOpen, 
  Brain,
  Flame,
  Calendar,
  Award
} from "lucide-react";

export default function ProgressPage() {
  const { user } = useAuth();

  const { data: progress, isLoading: progressLoading } = useQuery({
    queryKey: ['/api/progress'],
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/stats'],
  });

  const { data: achievements = [], isLoading: achievementsLoading } = useQuery({
    queryKey: ['/api/achievements'],
  });

  if (progressLoading || statsLoading || achievementsLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 lg:pb-8">
          <div className="grid gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="card-kid">
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                    <div className="h-8 bg-slate-200 rounded w-1/2"></div>
                    <div className="h-2 bg-slate-200 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    );
  }

  const overallProgress = progress ? (progress.completedLessons / Math.max(progress.totalLessons, 1)) * 100 : 0;
  const studyTimeHours = Math.floor((user?.totalStudyTime || 0) / 60);
  const studyTimeMinutes = (user?.totalStudyTime || 0) % 60;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 lg:pb-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl text-slate-900 dark:text-white mb-2">
            Your Learning Journey
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Track your progress and celebrate your achievements
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="card-kid">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Trophy className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                    {user?.xpPoints || 0}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Total XP</div>
                </CardContent>
              </Card>

              <Card className="card-kid">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="w-6 h-6 text-success" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                    {progress?.completedLessons || 0}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Lessons Completed</div>
                </CardContent>
              </Card>

              <Card className="card-kid">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 text-accent" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                    {studyTimeHours}h {studyTimeMinutes}m
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Study Time</div>
                </CardContent>
              </Card>

              <Card className="card-kid">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Flame className="w-6 h-6 text-secondary" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                    {user?.currentStreak || 0}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Day Streak</div>
                </CardContent>
              </Card>
            </div>

            {/* Overall Progress */}
            <Card className="card-kid">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Overall Progress</h3>
                
                <div className="flex items-center space-x-8">
                  <ProgressRing progress={overallProgress} size="large" />
                  <div className="flex-1">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <div className="text-2xl font-bold text-primary mb-1">
                          {Math.round(overallProgress)}%
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          Learning Progress
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-success mb-1">
                          {progress?.subjectProgress?.length || 0}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          Active Subjects
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-900 dark:text-white">Weekly Goal</span>
                          <span className="text-slate-600 dark:text-slate-400">
                            {progress?.completedLessons || 0}/20 lessons
                          </span>
                        </div>
                        <Progress value={((progress?.completedLessons || 0) / 20) * 100} className="h-2" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="card-kid">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Recent Activity</h3>
                
                <div className="space-y-4">
                  {achievements.slice(0, 5).map((achievement: any, index: number) => (
                    <div key={achievement.id || index} className="flex items-center space-x-4 p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                      <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                        <Award className="w-5 h-5 text-accent" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900 dark:text-white text-sm">
                          {achievement.achievement?.name || 'Achievement Unlocked'}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          {achievement.earnedAt ? new Date(achievement.earnedAt).toLocaleDateString() : 'Recently'}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        +{achievement.achievement?.xpReward || 10} XP
                      </Badge>
                    </div>
                  )) || (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                      <p className="text-slate-500 dark:text-slate-400">
                        Start learning to see your activity here!
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subjects" className="space-y-6">
            {/* Subject Progress */}
            <div className="grid gap-6">
              {progress?.subjectProgress?.map((subjectProgress: any) => (
                <Card key={subjectProgress.subjectId} className="card-kid">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-primary" />
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
                        <div className="text-2xl font-bold text-primary">
                          {Math.round(subjectProgress.progress)}%
                        </div>
                      </div>
                    </div>
                    
                    <Progress value={subjectProgress.progress} className="h-3" />
                    
                    <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-semibold text-slate-900 dark:text-white">
                          {subjectProgress.completedLessons}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">Completed</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-slate-900 dark:text-white">
                          {subjectProgress.totalLessons - subjectProgress.completedLessons}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">Remaining</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-slate-900 dark:text-white">
                          {subjectProgress.totalLessons}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">Total</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )) || (
                <Card className="card-kid">
                  <CardContent className="p-12 text-center">
                    <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                      No Subject Progress Yet
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Start learning to see your progress across different subjects.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            {/* Achievements Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.length > 0 ? achievements.map((achievement: any) => (
                <Card key={achievement.id} className="card-kid group hover:scale-105 transition-all">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-accent to-warning rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-bounce">
                      <Award className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                      {achievement.achievement?.name || 'Achievement'}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                      {achievement.achievement?.description || 'Achievement description'}
                    </p>
                    <Badge variant="secondary" className="mb-2">
                      +{achievement.achievement?.xpReward || 0} XP
                    </Badge>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Earned {achievement.earnedAt ? new Date(achievement.earnedAt).toLocaleDateString() : 'Recently'}
                    </p>
                  </CardContent>
                </Card>
              )) : (
                <div className="col-span-full">
                  <Card className="card-kid">
                    <CardContent className="p-12 text-center">
                      <Trophy className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                        No Achievements Yet
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400">
                        Keep learning to unlock your first achievement!
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Learning Analytics */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="card-kid">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Learning Stats</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                          <TrendingUp className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">Average Score</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Quiz performance</p>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-primary">
                        {Math.round(stats?.averageScore || 0)}%
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center">
                          <Clock className="w-5 h-5 text-success" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">Study Time</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Total learning time</p>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-success">
                        {Math.floor((stats?.totalStudyTime || 0) / 60)}h
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                          <Star className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">Best Subject</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Top performance</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-accent">
                          {stats?.strongSubjects?.[0] || 'None yet'}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-kid">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Improvement Areas</h3>
                  
                  <div className="space-y-4">
                    {stats?.improvementAreas?.length > 0 ? (
                      stats.improvementAreas.map((area: string, index: number) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                          <div className="w-8 h-8 bg-warning/10 rounded-lg flex items-center justify-center">
                            <Target className="w-4 h-4 text-warning" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">{area}</p>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                              Focus on this subject for better results
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Brain className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                        <p className="text-slate-500 dark:text-slate-400">
                          Great job! No areas need improvement right now.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <BottomNavigation />
      <VoiceAssistant />
    </div>
  );
}
