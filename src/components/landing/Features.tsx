import { motion } from 'framer-motion';
import { 
  Target, 
  MessageSquare, 
  TrendingUp, 
  Clock, 
  Shield, 
  Zap 
} from 'lucide-react';

const features = [
  {
    icon: Target,
    title: 'Personalized Questions',
    description: 'AI generates questions based on your role and experience level, ensuring relevant practice every time.'
  },
  {
    icon: MessageSquare,
    title: 'Detailed Feedback',
    description: 'Receive comprehensive analysis of your answers with specific suggestions for improvement.'
  },
  {
    icon: TrendingUp,
    title: 'Progress Tracking',
    description: 'Monitor your growth over time with detailed history and performance analytics.'
  },
  {
    icon: Clock,
    title: 'Practice Anytime',
    description: 'Access unlimited interview practice sessions whenever you need them, 24/7.'
  },
  {
    icon: Shield,
    title: 'Industry Standards',
    description: 'Questions align with real interview patterns from top tech companies.'
  },
  {
    icon: Zap,
    title: 'Instant Results',
    description: 'Get immediate scores and sample answers to accelerate your learning.'
  }
];

export function Features() {
  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
            Everything You Need to <span className="text-gradient">Succeed</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Comprehensive tools and features designed to help you ace your next technical interview
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card-elevated p-8 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-5">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold font-display mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
