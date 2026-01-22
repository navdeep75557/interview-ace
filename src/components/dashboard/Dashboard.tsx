import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Play, 
  LogOut, 
  TrendingUp, 
  Clock, 
  Target,
  ChevronRight,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Interview } from '@/lib/types';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export function Dashboard() {
  const navigate = useNavigate();
  const { user, profile, signOut, loading: authLoading } = useAuth();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchInterviews = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('interviews')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setInterviews(data as Interview[]);
      }
      setLoading(false);
    };

    if (user) {
      fetchInterviews();
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Check if user needs setup
  useEffect(() => {
    if (!authLoading && profile && (!profile.role || !profile.experience_level)) {
      navigate('/setup');
    }
  }, [profile, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const completedInterviews = interviews.filter(i => i.completed_at);
  const averageScore = completedInterviews.length > 0
    ? Math.round(completedInterviews.reduce((sum, i) => sum + (i.ai_score || 0), 0) / completedInterviews.length * 10) / 10
    : 0;

  const roleLabels = {
    frontend: 'Frontend Developer',
    backend: 'Backend Developer',
    fullstack: 'Full Stack Developer'
  };

  const levelLabels = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced'
  };

  const getScoreColor = (score: number | null) => {
    if (score === null) return 'text-muted-foreground';
    if (score >= 8) return 'text-success';
    if (score >= 6) return 'text-primary';
    if (score >= 4) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold font-display text-gradient">InterviewAce AI</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {profile?.full_name || user?.email}
            </span>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold font-display mb-2">
            Welcome back, {profile?.full_name?.split(' ')[0] || 'there'}!
          </h2>
          <p className="text-muted-foreground">
            {profile?.role && roleLabels[profile.role]} • {profile?.experience_level && levelLabels[profile.experience_level]}
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="card-elevated p-6">
            <div className="flex items-center justify-between mb-4">
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
            <p className="text-3xl font-bold font-display">{completedInterviews.length}</p>
            <p className="text-muted-foreground text-sm">Completed Interviews</p>
          </div>

          <div className="card-elevated p-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
            <p className={`text-3xl font-bold font-display ${getScoreColor(averageScore)}`}>
              {averageScore > 0 ? `${averageScore}/10` : 'N/A'}
            </p>
            <p className="text-muted-foreground text-sm">Average Score</p>
          </div>

          <div className="card-elevated p-6">
            <div className="flex items-center justify-between mb-4">
              <Target className="h-8 w-8 text-warning" />
            </div>
            <p className="text-3xl font-bold font-display">
              {completedInterviews.filter(i => (i.ai_score || 0) >= 8).length}
            </p>
            <p className="text-muted-foreground text-sm">Excellent Scores</p>
          </div>
        </motion.div>

        {/* Start Practice CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="hero-gradient rounded-2xl p-8 mb-8 relative overflow-hidden"
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold font-display text-white mb-2">
                Ready for Practice?
              </h3>
              <p className="text-white/70">
                Start a new interview session and improve your skills
              </p>
            </div>
            <Button
              onClick={() => navigate('/interview')}
              className="btn-hero shrink-0"
              size="lg"
            >
              <Play className="mr-2 h-5 w-5" />
              Start Interview
            </Button>
          </div>
        </motion.div>

        {/* Interview History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xl font-bold font-display mb-4">Recent Practice Sessions</h3>
          
          {completedInterviews.length === 0 ? (
            <div className="card-elevated p-12 text-center">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h4 className="font-semibold mb-2">No interviews yet</h4>
              <p className="text-muted-foreground mb-6">
                Start your first practice session to begin tracking your progress
              </p>
              <Button onClick={() => navigate('/interview')}>
                Start Your First Interview
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {completedInterviews.slice(0, 10).map((interview, index) => (
                <motion.div
                  key={interview.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => navigate(`/feedback/${interview.id}`)}
                  className="card-elevated p-6 cursor-pointer hover:shadow-lg transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate mb-1">{interview.question}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(interview.completed_at!).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 ml-4">
                      <div className={`text-2xl font-bold font-display ${getScoreColor(interview.ai_score)}`}>
                        {interview.ai_score}/10
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
