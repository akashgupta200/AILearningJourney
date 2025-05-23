import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { queryClient } from "@/lib/queryClient";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import VoiceAssistant from "@/components/VoiceAssistant";
import AITutorChat from "@/components/AITutorChat";
import SubjectCard from "@/components/SubjectCard";
import AchievementCard from "@/components/AchievementCard";
import ProgressRing from "@/components/ProgressRing";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Play, Brain, Gamepad, Trophy, Star, Flame } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function Dashboard() {
  const { user } = useAuth();

  // Initialize default data
  const initMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/init'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/subjects'] });
    },
  });

  // Fetch user progress
  const { data: progress } = useQuery({
    queryKey: ['/api/progress'],
  });

  // Fetch subjects
  const { data: subjects = [] } = useQuery({
    queryKey: ['/api/subjects'],
  });

  // Fetch achievements
  const { data: achievements = [] } = useQuery({
    queryKey: ['/api/achievements'],
  });

  // Fetch AI encouragement
  const { data: encouragement } = useQuery({
    queryKey: ['/api/ai/encouragement'],
  });

  useEffect(() => {
    // Initialize default subjects on first load
    if (subjects.length === 0) {
      initMutation.mutate();
    }
  }, [subjects.length]);

  const todayProgress = progress ? (progress.completedLessons / Math.max(progress.totalLessons, 1)) * 100 : 0;
  const recentAchievements = achievements.slice(0, 3);

  // Mock weekly goals for now
  const weeklyGoals = [
    { title: "Complete 20 lessons", progress: 75, current: 15, total: 20 },
    { title: "Earn 500 XP", progress: 76, current: user?.xpPoints || 0, total: 500 },
    { title: "Study 5 hours", progress: 64, current: (user?.totalStudyTime || 0) / 60, total: 5 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 lg:pb-8">
        {/* Welcome Section */}
        <section className="mb-8">
          <div className="card-gradient from-primary via-secondary to-accent text-white relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="font-display text-3xl sm:text-4xl mb-2">
                Welcome back, {user?.firstName || 'Explorer'}! 🚀
              </h2>
              <p className="text-lg opacity-90 mb-6">
                {encouragement?.message || "Ready to explore the universe of knowledge today?"}
              </p>
              
              <div className="flex items-center space-x-6">
                <ProgressRing progress={todayProgress} />
                <div>
                  <p className="text-sm opacity-75">Today's Progress</p>
                  <p className="font-semibold">
                    {progress?.completedLessons || 0} of {progress?.totalLessons || 0} lessons completed
                  </p>
                </div>
              </div>
            </div>
            
            <div className="absolute top-4 right-4 text-4xl animate-float">🌟</div>
            <div className="absolute bottom-4 right-12 text-2xl animate-bounce-slow">🎓</div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Button className="card-kid p-6 h-auto hover:scale-105 transition-all group bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
              <div className="flex flex-col items-center space-y-3">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center group-hover:animate-bounce">
                  <Play className="text-white text-lg" />
                </div>
                <p className="font-semibold">Continue Learning</p>
              </div>
            </Button>

            <Button className="card-kid p-6 h-auto hover:scale-105 transition-all group bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
              <div className="flex flex-col items-center space-y-3">
                <div className="w-12 h-12 bg-success rounded-xl flex items-center justify-center group-hover:animate-bounce">
                  <Brain className="text-white text-lg" />
                </div>
                <p className="font-semibold">Ask AI Tutor</p>
              </div>
            </Button>

            <Button className="card-kid p-6 h-auto hover:scale-105 transition-all group bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
              <div className="flex flex-col items-center space-y-3">
                <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center group-hover:animate-bounce">
                  <Gamepad className="text-white text-lg" />
                </div>
                <p className="font-semibold">Brain Games</p>
              </div>
            </Button>

            <Button className="card-kid p-6 h-auto hover:scale-105 transition-all group bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
              <div className="flex flex-col items-center space-y-3">
                <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center group-hover:animate-bounce">
                  <Trophy className="text-white text-lg" />
                </div>
                <p className="font-semibold">Achievements</p>
              </div>
            </Button>
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Learning Modules */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Lesson with AI Tutor */}
            <Card className="card-kid">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Continue Your Journey</h3>
                  <span className="text-sm text-slate-500 dark:text-slate-400">15 min left</span>
                </div>

                <AITutorChat />

                <div className="mt-6 space-y-4">
                  <div className="aspect-video bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center">
                    <div className="text-center">
                      <Brain className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                      <p className="text-slate-500 dark:text-slate-400">Interactive lesson content</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Button variant="secondary" className="rounded-full">
                      Previous
                    </Button>
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      <div className="w-3 h-3 bg-slate-300 rounded-full"></div>
                      <div className="w-3 h-3 bg-slate-300 rounded-full"></div>
                    </div>
                    <Button className="btn-primary rounded-full">
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subject Modules */}
            <Card className="card-kid">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Your Subjects</h3>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  {subjects.map((subject: any) => (
                    <SubjectCard key={subject.id} subject={subject} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Progress & Activities */}
          <div className="space-y-6">
            {/* Achievement Showcase */}
            <Card className="card-kid">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Latest Achievements</h3>
                
                <div className="space-y-3">
                  {recentAchievements.length > 0 ? (
                    recentAchievements.map((achievement: any) => (
                      <AchievementCard key={achievement.id} achievement={achievement} />
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Trophy className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                      <p className="text-slate-500 dark:text-slate-400">Start learning to earn your first achievement!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Weekly Goals */}
            <Card className="card-kid">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Weekly Goals</h3>
                
                <div className="space-y-4">
                  {weeklyGoals.map((goal, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-slate-900 dark:text-white">{goal.title}</span>
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          {goal.current}/{goal.total}
                        </span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Learning Streak */}
            <Card className="card-gradient from-primary to-secondary text-white">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-2">
                  <Flame />
                </div>
                <h3 className="text-2xl font-bold mb-1">{user?.currentStreak || 0} Day</h3>
                <p className="text-sm opacity-90">Learning Streak</p>
                <div className="mt-4 flex justify-center space-x-1">
                  {[...Array(7)].map((_, i) => (
                    <div key={i} className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      i < (user?.currentStreak || 0) ? 'bg-white' : 'bg-white/30'
                    }`}>
                      <div className={`w-3 h-3 rounded-full ${
                        i < (user?.currentStreak || 0) ? 'bg-primary' : 'bg-white'
                      }`}></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Daily Brain Challenge */}
            <Card className="card-kid">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Daily Brain Challenge</h3>
                
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-2xl">
                    <p className="text-sm font-medium text-slate-900 dark:text-white mb-3">
                      What is the largest planet in our solar system?
                    </p>
                    
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full text-left justify-start">
                        A) Earth
                      </Button>
                      <Button variant="outline" className="w-full text-left justify-start">
                        B) Jupiter
                      </Button>
                      <Button variant="outline" className="w-full text-left justify-start">
                        C) Saturn
                      </Button>
                    </div>
                  </div>
                  
                  <Button className="w-full btn-success">
                    Submit Answer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <BottomNavigation />
      <VoiceAssistant />
    </div>
  );
}
