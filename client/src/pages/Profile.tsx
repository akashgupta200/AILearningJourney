import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/components/ThemeProvider";
import { queryClient } from "@/lib/queryClient";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import VoiceAssistant from "@/components/VoiceAssistant";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Settings, 
  Crown, 
  Trophy, 
  Star,
  Volume2,
  Moon,
  Sun,
  Shield,
  Bell,
  LogOut,
  Edit3,
  Save,
  X,
  Heart,
  Accessibility
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    age: user?.age || '',
    gradeLevel: user?.gradeLevel || '',
    preferredLanguage: user?.preferredLanguage || 'en',
  });

  // Fetch user achievements
  const { data: achievements = [] } = useQuery({
    queryKey: ['/api/achievements'],
  });

  // Fetch user stats
  const { data: stats } = useQuery({
    queryKey: ['/api/stats'],
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data: any) => apiRequest('PATCH', '/api/user/profile', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      setIsEditing(false);
      toast({
        title: "Profile Updated! 🎉",
        description: "Your profile has been successfully updated.",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSaveProfile = () => {
    updateProfileMutation.mutate(profileData);
  };

  const handleLogout = () => {
    window.location.href = '/api/logout';
  };

  const recentAchievements = achievements.slice(0, 3);
  const studyTimeHours = Math.floor((user?.totalStudyTime || 0) / 60);
  const studyTimeMinutes = (user?.totalStudyTime || 0) % 60;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 lg:pb-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl text-slate-900 dark:text-white mb-2">
            My Profile
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Manage your account and learning preferences
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="card-kid">
              <CardContent className="p-6 text-center">
                <div className="relative mb-6">
                  <Avatar className="w-24 h-24 mx-auto border-4 border-primary">
                    <AvatarImage src={user?.profileImageUrl} />
                    <AvatarFallback className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary text-white">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-success rounded-full border-4 border-white dark:border-slate-800 flex items-center justify-center">
                    <Crown className="w-4 h-4 text-white" />
                  </div>
                </div>

                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  {user?.email}
                </p>

                <div className="flex justify-center space-x-2 mb-6">
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    Level {Math.floor((user?.xpPoints || 0) / 100) + 1}
                  </Badge>
                  <Badge variant="secondary" className="bg-accent/10 text-accent">
                    {user?.xpPoints || 0} XP
                  </Badge>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {user?.currentStreak || 0}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">Day Streak</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success">
                      {achievements.length}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">Achievements</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="privacy">Privacy</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-6">
                {/* Profile Information */}
                <Card className="card-kid">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        Profile Information
                      </h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(!isEditing)}
                        className="flex items-center space-x-2"
                      >
                        {isEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                        <span>{isEditing ? 'Cancel' : 'Edit'}</span>
                      </Button>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={user?.firstName || ''}
                          disabled={true}
                          className="bg-slate-50 dark:bg-slate-700"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={user?.lastName || ''}
                          disabled={true}
                          className="bg-slate-50 dark:bg-slate-700"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          value={user?.email || ''}
                          disabled={true}
                          className="bg-slate-50 dark:bg-slate-700"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="age">Age</Label>
                        <Input
                          id="age"
                          type="number"
                          min="5"
                          max="16"
                          value={profileData.age}
                          onChange={(e) => setProfileData(prev => ({ ...prev, age: parseInt(e.target.value) || '' }))}
                          disabled={!isEditing}
                          className={!isEditing ? 'bg-slate-50 dark:bg-slate-700' : ''}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="gradeLevel">Grade Level</Label>
                        <Select
                          value={profileData.gradeLevel.toString()}
                          onValueChange={(value) => setProfileData(prev => ({ ...prev, gradeLevel: parseInt(value) }))}
                          disabled={!isEditing}
                        >
                          <SelectTrigger className={!isEditing ? 'bg-slate-50 dark:bg-slate-700' : ''}>
                            <SelectValue placeholder="Select grade level" />
                          </SelectTrigger>
                          <SelectContent>
                            {[...Array(12)].map((_, i) => (
                              <SelectItem key={i + 1} value={(i + 1).toString()}>
                                Grade {i + 1}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="language">Preferred Language</Label>
                        <Select
                          value={profileData.preferredLanguage}
                          onValueChange={(value) => setProfileData(prev => ({ ...prev, preferredLanguage: value }))}
                          disabled={!isEditing}
                        >
                          <SelectTrigger className={!isEditing ? 'bg-slate-50 dark:bg-slate-700' : ''}>
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                            <SelectItem value="zh">Chinese</SelectItem>
                            <SelectItem value="ja">Japanese</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex justify-end space-x-3 mt-6">
                        <Button
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSaveProfile}
                          disabled={updateProfileMutation.isPending}
                          className="btn-primary"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Learning Stats */}
                <Card className="card-kid">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                      Learning Statistics
                    </h3>

                    <div className="grid sm:grid-cols-3 gap-6">
                      <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                          <Trophy className="w-6 h-6 text-primary" />
                        </div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                          {user?.xpPoints || 0}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Total XP Points</div>
                      </div>

                      <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
                        <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                          <Star className="w-6 h-6 text-success" />
                        </div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                          {Math.round(stats?.averageScore || 0)}%
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Average Score</div>
                      </div>

                      <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
                        <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                          <Heart className="w-6 h-6 text-accent" />
                        </div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                          {studyTimeHours}h {studyTimeMinutes}m
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Study Time</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="achievements" className="space-y-6">
                {/* Recent Achievements */}
                <Card className="card-kid">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                      Your Achievements
                    </h3>

                    <div className="grid sm:grid-cols-2 gap-4">
                      {recentAchievements.length > 0 ? recentAchievements.map((achievement: any) => (
                        <div key={achievement.id} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-accent/10 to-warning/10 rounded-xl">
                          <div className="w-12 h-12 bg-gradient-to-r from-accent to-warning rounded-full flex items-center justify-center animate-pulse-slow">
                            <Trophy className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-slate-900 dark:text-white">
                              {achievement.achievement?.name || 'Achievement'}
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {achievement.achievement?.description || 'Achievement description'}
                            </p>
                            <Badge variant="secondary" className="mt-1 text-xs">
                              +{achievement.achievement?.xpReward || 0} XP
                            </Badge>
                          </div>
                        </div>
                      )) : (
                        <div className="col-span-2 text-center py-8">
                          <Trophy className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                          <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                            No Achievements Yet
                          </h4>
                          <p className="text-slate-600 dark:text-slate-400">
                            Keep learning to unlock your first achievement!
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                {/* App Settings */}
                <Card className="card-kid">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                      App Settings
                    </h3>

                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">Dark Mode</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Switch between light and dark themes
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={theme === 'dark'}
                          onCheckedChange={toggleTheme}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Volume2 className="w-5 h-5" />
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">Sound Effects</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Enable audio feedback and sound effects
                            </p>
                          </div>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Bell className="w-5 h-5" />
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">Learning Reminders</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Get notified about your daily learning goals
                            </p>
                          </div>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Accessibility className="w-5 h-5" />
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">Accessibility Features</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Enable high contrast and dyslexia-friendly fonts
                            </p>
                          </div>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="privacy" className="space-y-6">
                {/* Privacy Settings */}
                <Card className="card-kid">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                      <Shield className="w-6 h-6 mr-2 text-primary" />
                      Privacy & Safety
                    </h3>

                    <div className="space-y-6">
                      <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                          Your Data is Safe
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          We follow strict privacy guidelines to protect your learning data. 
                          All information is encrypted and used only to improve your learning experience.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">Share Progress with Parents</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Allow parents to view your learning progress
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">Anonymous Analytics</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Help improve the app with anonymous usage data
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>

                      <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                        <Button
                          variant="destructive"
                          onClick={handleLogout}
                          className="w-full"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <BottomNavigation />
      <VoiceAssistant />
    </div>
  );
}
