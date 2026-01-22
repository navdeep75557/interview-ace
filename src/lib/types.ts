export type UserRole = 'frontend' | 'backend' | 'fullstack';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  role: UserRole | null;
  experience_level: ExperienceLevel | null;
  created_at: string;
  updated_at: string;
}

export interface Interview {
  id: string;
  user_id: string;
  role: UserRole;
  experience_level: ExperienceLevel;
  question: string;
  user_answer: string | null;
  ai_feedback: string | null;
  ai_score: number | null;
  improvement_tips: string | null;
  sample_answer: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface AIEvaluation {
  feedback: string;
  score: number;
  improvementTips: string;
  sampleAnswer: string;
}
