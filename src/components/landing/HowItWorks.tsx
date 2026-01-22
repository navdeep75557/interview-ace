import { motion } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'Choose Your Path',
    description: 'Select your role (Frontend, Backend, or Full Stack) and experience level to get tailored questions.'
  },
  {
    number: '02',
    title: 'Answer Questions',
    description: 'Respond to AI-generated interview questions that match real-world technical interviews.'
  },
  {
    number: '03',
    title: 'Get AI Feedback',
    description: 'Receive instant scoring, detailed feedback, improvement tips, and sample answers.'
  },
  {
    number: '04',
    title: 'Track & Improve',
    description: 'Monitor your progress over time and focus on areas that need the most improvement.'
  }
];

export function HowItWorks() {
  return (
    <section className="section-padding bg-muted/30">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Get started in minutes and begin improving your interview skills today
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative"
            >
              {/* Connection line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-border -translate-x-4" />
              )}
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground font-bold text-xl font-display mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold font-display mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
