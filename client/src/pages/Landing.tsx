import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Rocket, Brain, Trophy, Users, Star, Sparkles } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = '/api/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
      {/* Header */}
      <header className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-lg border-b-4 border-primary sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center animate-glow">
                <Rocket className="text-white text-lg" />
              </div>
              <h1 className="font-display text-2xl text-primary dark:text-white">EduVerse</h1>
            </div>
            <Button onClick={handleLogin} className="btn-primary">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-3xl flex items-center justify-center animate-float">
                <Brain className="text-white text-4xl" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center animate-bounce-slow">
                <Sparkles className="text-white text-sm" />
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-display text-slate-900 dark:text-white mb-6">
            Welcome to the{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              AI Tutor Universe
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
            Learn with your personal AI tutor, explore interactive lessons, and make education an adventure! 
            Perfect for students aged 5-16.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button onClick={handleLogin} size="lg" className="btn-primary text-lg px-8 py-4">
              <Rocket className="mr-2" />
              Start Learning Today
            </Button>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Free to get started • No credit card required
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-display text-center text-slate-900 dark:text-white mb-12">
            Why Kids Love EduVerse
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="card-kid group hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:animate-bounce">
                  <Brain className="text-white text-2xl" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">AI Tutors</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  Personal AI tutors that adapt to your learning style and pace
                </p>
              </CardContent>
            </Card>

            <Card className="card-kid group hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:animate-bounce">
                  <Trophy className="text-white text-2xl" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Gamification</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  Earn XP, unlock achievements, and compete with friends
                </p>
              </CardContent>
            </Card>

            <Card className="card-kid group hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:animate-bounce">
                  <Users className="text-white text-2xl" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Social Learning</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  Learn together with classmates and AI companions
                </p>
              </CardContent>
            </Card>

            <Card className="card-kid group hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:animate-bounce">
                  <Star className="text-white text-2xl" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Personalized</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  Lessons that adapt to your interests and learning goals
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="card-gradient from-primary to-secondary">
            <div className="relative z-10">
              <h2 className="font-display text-3xl sm:text-4xl mb-4">
                Ready to Start Your Learning Adventure?
              </h2>
              <p className="text-lg opacity-90 mb-8">
                Join thousands of students already learning with EduVerse AI tutors
              </p>
              <Button onClick={handleLogin} size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-4">
                <Rocket className="mr-2" />
                Begin Your Journey
              </Button>
            </div>
            <div className="absolute top-4 right-4 text-4xl animate-float">🌟</div>
            <div className="absolute bottom-4 left-8 text-2xl animate-bounce-slow">🎓</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <Rocket className="text-white text-sm" />
            </div>
            <span className="font-display text-xl">EduVerse</span>
          </div>
          <p className="text-slate-400">
            Making education accessible, engaging, and effective for every child.
          </p>
        </div>
      </footer>
    </div>
  );
}
