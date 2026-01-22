import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, Lightbulb, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Interview } from '@/lib/types';

export function FeedbackDisplay() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterview = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from('interviews')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        setInterview(data as Interview);
      }
      setLoading(false);
    };

    fetchInterview();
  }, [id]);

  const getScoreColor = (score: number | null) => {
    if (score === null) return 'text-muted-foreground';
    if (score >= 8) return 'text-success';
    if (score >= 6) return 'text-primary';
    if (score >= 4) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreLabel = (score: number | null) => {
    if (score === null) return 'N/A';
    if (score >= 8) return 'Excellent';
    if (score >= 6) return 'Good';
    if (score >= 4) return 'Average';
    return 'Needs Work';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Interview not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold font-display text-gradient">InterviewAce AI</h1>
          <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
            Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Score Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className={`inline-flex items-center justify-center w-32 h-32 rounded-full border-4 mb-4 ${getScoreColor(interview.ai_score)}`}
              style={{ borderColor: 'currentColor' }}
            >
              <div>
                <span className="text-5xl font-bold font-display">{interview.ai_score}</span>
                <span className="text-2xl text-muted-foreground">/10</span>
              </div>
            </motion.div>
            <h2 className={`text-2xl font-bold font-display ${getScoreColor(interview.ai_score)}`}>
              {getScoreLabel(interview.ai_score)}
            </h2>
          </div>

          {/* Question */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-elevated p-6 mb-6"
          >
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Question</h3>
            <p className="text-lg font-medium">{interview.question}</p>
          </motion.div>

          {/* Your Answer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card-elevated p-6 mb-6"
          >
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Your Answer</h3>
            <p className="whitespace-pre-wrap">{interview.user_answer}</p>
          </motion.div>

          {/* Feedback Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* AI Feedback */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card-elevated p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">AI Feedback</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">{interview.ai_feedback}</p>
            </motion.div>

            {/* Improvement Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card-elevated p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="h-5 w-5 text-warning" />
                <h3 className="font-semibold">Improvement Tips</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">{interview.improvement_tips}</p>
            </motion.div>
          </div>

          {/* Sample Answer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card-elevated p-6 mb-8 border-l-4 border-l-success"
          >
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-success" />
              <h3 className="font-semibold">Sample Answer</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {interview.sample_answer}
            </p>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex gap-4 justify-center"
          >
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
              size="lg"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Dashboard
            </Button>
            <Button
              onClick={() => navigate('/interview')}
              className="btn-hero"
              size="lg"
            >
              Practice Again
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
