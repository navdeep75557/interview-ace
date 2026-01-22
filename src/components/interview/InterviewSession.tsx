import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Loader2, Send, ArrowRight, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function InterviewSession() {
  const navigate = useNavigate();
  const { profile, user } = useAuth();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [interviewId, setInterviewId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const generateQuestion = async () => {
    if (!profile?.role || !profile?.experience_level || !user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-question', {
        body: { 
          role: profile.role, 
          experienceLevel: profile.experience_level 
        }
      });

      if (error) throw error;

      setQuestion(data.question);

      // Create interview record
      const { data: interview, error: insertError } = await supabase
        .from('interviews')
        .insert({
          user_id: user.id,
          role: profile.role,
          experience_level: profile.experience_level,
          question: data.question
        })
        .select()
        .single();

      if (insertError) throw insertError;
      setInterviewId(interview.id);
    } catch (error) {
      console.error('Error generating question:', error);
      toast.error('Failed to generate question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile?.role && profile?.experience_level) {
      generateQuestion();
    }
  }, [profile]);

  const handleSubmit = async () => {
    if (!answer.trim() || !interviewId || !profile) return;

    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('evaluate-answer', {
        body: {
          question,
          answer,
          role: profile.role,
          experienceLevel: profile.experience_level
        }
      });

      if (error) throw error;

      // Update interview with results
      await supabase
        .from('interviews')
        .update({
          user_answer: answer,
          ai_feedback: data.feedback,
          ai_score: data.score,
          improvement_tips: data.improvementTips,
          sample_answer: data.sampleAnswer,
          completed_at: new Date().toISOString()
        })
        .eq('id', interviewId);

      navigate(`/feedback/${interviewId}`);
    } catch (error) {
      console.error('Error evaluating answer:', error);
      toast.error('Failed to evaluate your answer. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold font-display text-gradient">InterviewAce AI</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {profile?.role && roleLabels[profile.role]} • {profile?.experience_level && levelLabels[profile.experience_level]}
            </span>
            <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
              Dashboard
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Generating your interview question...</p>
            </motion.div>
          ) : (
            <motion.div
              key="question"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Question Card */}
              <div className="card-elevated p-8 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-primary bg-accent px-3 py-1 rounded-full">
                    Interview Question
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={generateQuestion}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    New Question
                  </Button>
                </div>
                <p className="text-xl font-medium leading-relaxed">{question}</p>
              </div>

              {/* Answer Section */}
              <div className="card-elevated p-8">
                <label className="block text-sm font-medium mb-4">Your Answer</label>
                <Textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer here. Be as detailed as you would be in a real interview..."
                  className="min-h-[200px] input-field resize-none"
                />
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-muted-foreground">
                    {answer.length} characters
                  </p>
                  <Button
                    onClick={handleSubmit}
                    disabled={!answer.trim() || submitting}
                    className="btn-hero"
                  >
                    {submitting ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        Submit Answer
                        <Send className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Tips */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-8 p-6 rounded-2xl bg-muted/50 border"
              >
                <h3 className="font-semibold mb-3">Tips for a Great Answer</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                    Be specific and provide concrete examples from your experience
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                    Structure your answer clearly with a beginning, middle, and end
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                    Explain your thought process and reasoning
                  </li>
                </ul>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
