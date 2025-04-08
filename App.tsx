import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Mail, Check, AlertCircle, Briefcase, Code, Globe, Sparkles, ArrowRight } from 'lucide-react';
import { z } from 'zod';

const applicationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  gender: z.enum(['male', 'female', 'other'], { required_error: 'Please select a gender' }),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  github: z.string().url('Must be a valid URL').optional(),
  experienceYears: z.number().min(0, 'Years cannot be negative'),
  experienceMonths: z.number().min(0, 'Months cannot be negative').max(11, 'Months should be less than 12'),
  currentSalary: z.number().min(0, 'Salary cannot be negative'),
  expectedSalary: z.number().min(0, 'Salary cannot be negative'),
  availableToJoin: z.number().min(0, 'Days cannot be negative'),
  preferredLocation: z.string().min(1, 'Please select a location'),
  currentLocation: z.string().min(2, 'Current location is required'),
  reasonForChange: z.string().min(10, 'Please provide a detailed reason'),
  referredBy: z.string().optional(),
  noticePeriod: z.number().min(0, 'Notice period cannot be negative'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ApplicationForm = z.infer<typeof applicationSchema>;

const locations = [
  'Bangalore',
  'Mumbai',
  'Delhi',
  'Hyderabad',
  'Chennai',
  'Pune',
  'Remote',
];

const FeatureCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
    className="flex items-center space-x-4 p-4 rounded-2xl bg-white/10 backdrop-blur-sm transition-colors hover:bg-white/15"
  >
    <div className="bg-white/20 p-3 rounded-xl">
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-white/80 text-sm">{description}</p>
    </div>
  </motion.div>
);

function App() {
  const [form, setForm] = useState<ApplicationForm>({
    name: '',
    gender: 'male',
    email: '',
    phone: '',
    github: '',
    experienceYears: 0,
    experienceMonths: 0,
    currentSalary: 0,
    expectedSalary: 0,
    availableToJoin: 0,
    preferredLocation: '',
    currentLocation: '',
    reasonForChange: '',
    referredBy: '',
    noticePeriod: 0,
    message: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ApplicationForm, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      applicationSchema.parse(form);
      setSubmitted(true);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            formattedErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(formattedErrors);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
    if (errors[name as keyof ApplicationForm]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const renderField = (field: string, label: string, type: string = 'text', options?: string[]) => (
    <motion.div
      key={field}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="relative"
    >
      <label
        htmlFor={field}
        className={`block text-sm font-medium transition-colors duration-200 ${
          focusedField === field ? 'text-[#F97316]' : 'text-[#1F2937]'
        } mb-1`}
      >
        {label}
        {field !== 'referredBy' && ' *'}
      </label>
      {type === 'select' ? (
        <select
          id={field}
          name={field}
          value={form[field as keyof ApplicationForm] as string}
          onChange={handleChange}
          onFocus={() => setFocusedField(field)}
          onBlur={() => setFocusedField(null)}
          className={`w-full px-4 py-3 rounded-xl border bg-white/50 backdrop-blur-sm ${
            errors[field as keyof ApplicationForm]
              ? 'border-red-300 bg-red-50'
              : focusedField === field
              ? 'border-[#F97316] bg-orange-50/30'
              : 'border-[#F3F4F6]'
          } focus:ring-2 focus:ring-[#F97316] focus:border-transparent transition-all duration-200`}
        >
          <option value="">Select an option</option>
          {options?.map((option) => (
            <option key={option} value={option.toLowerCase()}>
              {option}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          id={field}
          name={field}
          value={form[field as keyof ApplicationForm] as string}
          onChange={handleChange}
          onFocus={() => setFocusedField(field)}
          onBlur={() => setFocusedField(null)}
          rows={4}
          className={`w-full px-4 py-3 rounded-xl border bg-white/50 backdrop-blur-sm ${
            errors[field as keyof ApplicationForm]
              ? 'border-red-300 bg-red-50'
              : focusedField === field
              ? 'border-[#F97316] bg-orange-50/30'
              : 'border-[#F3F4F6]'
          } focus:ring-2 focus:ring-[#F97316] focus:border-transparent transition-all duration-200`}
        />
      ) : (
        <input
          type={type}
          id={field}
          name={field}
          value={form[field as keyof ApplicationForm]}
          onChange={handleChange}
          onFocus={() => setFocusedField(field)}
          onBlur={() => setFocusedField(null)}
          className={`w-full px-4 py-3 rounded-xl border bg-white/50 backdrop-blur-sm ${
            errors[field as keyof ApplicationForm]
              ? 'border-red-300 bg-red-50'
              : focusedField === field
              ? 'border-[#F97316] bg-orange-50/30'
              : 'border-[#F3F4F6]'
          } focus:ring-2 focus:ring-[#F97316] focus:border-transparent transition-all duration-200`}
        />
      )}
      <AnimatePresence>
        {errors[field as keyof ApplicationForm] && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 text-sm text-red-600 flex items-center gap-1"
          >
            <AlertCircle className="w-4 h-4" />
            {errors[field as keyof ApplicationForm]}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#FFFAF0] relative overflow-hidden">
      <motion.div 
        className="absolute inset-0 opacity-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #F97316 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="max-w-5xl mx-auto px-4 py-12 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden"
        >
          <div className="grid md:grid-cols-5">
            <div className="md:col-span-2 bg-gradient-to-br from-[#F97316] to-[#10B981] p-8 md:p-12 text-white relative overflow-hidden">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="relative z-10"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Sparkles className="w-6 h-6" />
                  <h2 className="text-2xl font-bold">Join Our Team</h2>
                </div>
                <div className="space-y-4">
                  <FeatureCard
                    icon={Code}
                    title="Modern Tech Stack"
                    description="React, Node.js, TypeScript"
                  />
                  <FeatureCard
                    icon={Briefcase}
                    title="Remote First"
                    description="Work from anywhere"
                  />
                  <FeatureCard
                    icon={Globe}
                    title="Global Impact"
                    description="Build the future of web"
                  />
                </div>
              </motion.div>
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-20 -left-10 w-40 h-40 rounded-full bg-white/20" />
                <div className="absolute bottom-10 -right-10 w-60 h-60 rounded-full bg-white/20" />
              </div>
            </div>

            <div className="md:col-span-3 p-8 md:p-12">
              <div className="mb-8">
                <motion.h1 
                  className="text-3xl md:text-4xl font-bold text-[#1F2937] mb-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  Full-Stack Developer
                </motion.h1>
                <motion.p 
                  className="text-gray-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Join our team of innovative developers building the next generation of web applications.
                </motion.p>
              </div>

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-emerald-50 rounded-2xl p-8 flex items-center gap-4"
                  >
                    <div className="bg-emerald-500 rounded-full p-3">
                      <Check className="text-white w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-emerald-900">Application Submitted!</h3>
                      <p className="text-emerald-700 mt-1">We'll be in touch soon.</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="space-y-6">
                      {renderField('name', 'Full Name')}
                      {renderField('gender', 'Gender', 'select', ['Male', 'Female', 'Other'])}
                      {renderField('email', 'Email', 'email')}
                      {renderField('phone', 'Mobile Phone', 'tel')}
                      {renderField('github', 'GitHub Profile (optional)', 'url')}
                      
                      <div className="grid grid-cols-2 gap-4">
                        {renderField('experienceYears', 'Experience (Years)', 'number')}
                        {renderField('experienceMonths', 'Experience (Months)', 'number')}
                      </div>
                      
                      {renderField('currentSalary', 'Current Salary (INR)', 'number')}
                      {renderField('expectedSalary', 'Expected Salary (INR)', 'number')}
                      {renderField('availableToJoin', 'Available To Join (in days)', 'number')}
                      {renderField('preferredLocation', 'Preferred Location', 'select', locations)}
                      {renderField('currentLocation', 'Current Location')}
                      {renderField('reasonForChange', 'Reason for Job Change', 'textarea')}
                      {renderField('referredBy', 'Referred By')}
                      {renderField('noticePeriod', 'Notice Period (in days)', 'number')}
                      {renderField('message', 'Additional Message', 'textarea')}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      type="submit"
                      className="w-full bg-[#F97316] text-white py-3 px-6 rounded-xl font-medium hover:bg-[#F97316]/90 focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:ring-offset-2 transition-all duration-200 group flex items-center justify-center gap-2"
                    >
                      Submit Application
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-8 pt-8 border-t border-[#F3F4F6]"
              >
                <div className="flex justify-center space-x-6">
                  {[
                    { icon: Github, label: 'GitHub' },
                    { icon: Linkedin, label: 'LinkedIn' },
                    { icon: Mail, label: 'Email' },
                  ].map(({ icon: Icon, label }) => (
                    <motion.a
                      key={label}
                      href="#"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-gray-400 hover:text-[#F97316] transition-colors"
                      aria-label={label}
                    >
                      <Icon className="w-6 h-6" />
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default App;