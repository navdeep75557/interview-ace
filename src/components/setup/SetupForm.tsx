import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Code2, Server, Layers, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { UserRole, ExperienceLevel } from '@/lib/types';

const roles = [
  { id: 'frontend' as UserRole, label: 'Frontend Developer', icon: Code2, description: 'React, TypeScript, CSS, UI/UX' },
  { id: 'backend' as UserRole, label: 'Backend Developer', icon: Server, description: 'Node.js, APIs, Databases, System Design' },
  { id: 'fullstack' as UserRole, label: 'Full Stack Developer', icon: Layers, description: 'Both frontend and backend technologies' }
];

const experienceLevels = [
  { id: 'beginner' as ExperienceLevel, label: 'Beginner', description: '0-2 years of experience' },
  { id: 'intermediate' as ExperienceLevel, label: 'Intermediate', description: '2-5 years of experience' },
  { id: 'advanced' as ExperienceLevel, label: 'Advanced', description: '5+ years of experience' }
];

export function SetupForm() {
  const navigate = useNavigate();
  const { updateProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<ExperienceLevel | null>(null);
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (step === 1 && selectedRole) {
      setStep(2);
    } else if (step === 2 && selectedLevel && selectedRole) {
      setLoading(true);
      try {
        await updateProfile({ role: selectedRole, experience_level: selectedLevel });
        toast.success('Profile setup complete!');
        navigate('/dashboard');
      } catch (error) {
        toast.error('Failed to save preferences');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-3 mb-12">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`w-12 h-1.5 rounded-full transition-colors ${
                s <= step ? 'bg-primary' : 'bg-border'
              }`}
            />
          ))}
        </div>

        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold font-display mb-4">
            {step === 1 ? 'Choose Your Path' : 'Select Your Level'}
          </h1>
          <p className="text-muted-foreground text-lg">
            {step === 1 
              ? 'What type of developer role are you preparing for?'
              : 'What is your current experience level?'}
          </p>
        </div>

        {step === 1 ? (
          <div className="grid gap-4 mb-8">
            {roles.map((role) => (
              <motion.button
                key={role.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedRole(role.id)}
                className={`w-full p-6 rounded-2xl border-2 text-left transition-all ${
                  selectedRole === role.id
                    ? 'border-primary bg-accent shadow-glow'
                    : 'border-border bg-card hover:border-primary/50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    selectedRole === role.id ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    <role.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{role.label}</h3>
                    <p className="text-muted-foreground text-sm">{role.description}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 mb-8">
            {experienceLevels.map((level) => (
              <motion.button
                key={level.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedLevel(level.id)}
                className={`w-full p-6 rounded-2xl border-2 text-left transition-all ${
                  selectedLevel === level.id
                    ? 'border-primary bg-accent shadow-glow'
                    : 'border-border bg-card hover:border-primary/50'
                }`}
              >
                <h3 className="font-semibold text-lg mb-1">{level.label}</h3>
                <p className="text-muted-foreground text-sm">{level.description}</p>
              </motion.button>
            ))}
          </div>
        )}

        <div className="flex gap-4">
          {step === 2 && (
            <Button
              variant="outline"
              onClick={() => setStep(1)}
              className="flex-1"
              size="lg"
            >
              Back
            </Button>
          )}
          <Button
            onClick={handleContinue}
            disabled={(step === 1 && !selectedRole) || (step === 2 && !selectedLevel) || loading}
            className="flex-1 btn-hero"
            size="lg"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                {step === 2 ? 'Start Practicing' : 'Continue'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
