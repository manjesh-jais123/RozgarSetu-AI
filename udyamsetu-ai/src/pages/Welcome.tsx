import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { AIChatBot } from '../components/AIChatBot';
import { Header } from '../components/Header';
import { VoiceButton } from '../components/ui/VoiceButton';
import { useAuthStore } from '../hooks/useStores';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Bot,
  Briefcase,
  CheckCircle2,
  DollarSign,
  HeartHandshake,
  Lightbulb,
  Map,
  Package,
  ShieldCheck,
  Smartphone,
  Sparkles,
  TrendingUp,
  UserRound,
  Users,
} from 'lucide-react';

const features = [
  {
    title: 'Explore Opportunities',
    description: 'Discover livelihood ideas matched to your skills, budget, and location.',
    icon: TrendingUp,
    route: '/explore',
    tone: 'from-primary-50 to-primary-100',
    iconColor: 'text-primary-600',
  },
  {
    title: 'Learn & Upskill',
    description: 'Follow practical video lessons, quizzes, and step-by-step learning paths.',
    icon: BookOpen,
    route: '/learn',
    tone: 'from-secondary-50 to-secondary-100',
    iconColor: 'text-secondary-600',
  },
  {
    title: 'Business Planner',
    description: 'Turn an idea into a clear plan with costs, pricing, customers, and next actions.',
    icon: Briefcase,
    route: '/business',
    tone: 'from-amber-50 to-amber-100',
    iconColor: 'text-amber-600',
  },
  {
    title: 'Funding & Schemes',
    description: 'Find government schemes, loans, and grants with simple eligibility checks.',
    icon: DollarSign,
    route: '/funding',
    tone: 'from-green-50 to-green-100',
    iconColor: 'text-green-600',
  },
  {
    title: 'Product Catalogue',
    description: 'Create and manage a professional catalogue for everything you make.',
    icon: Package,
    route: '/products',
    tone: 'from-purple-50 to-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    title: 'Market & Buyers',
    description: 'Connect with verified buyers and share your requirements with the market.',
    icon: Users,
    route: '/market',
    tone: 'from-blue-50 to-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    title: 'AI Assistant',
    description: 'Get instant, personalized guidance for your business and learning journey.',
    icon: Bot,
    route: '/dashboard#ai-assistant',
    tone: 'from-cyan-50 to-cyan-100',
    iconColor: 'text-cyan-600',
  },
  {
    title: 'Smart Roadmap',
    description: 'See the next best action and track progress from idea to sustainable income.',
    icon: Map,
    route: '/roadmap',
    tone: 'from-rose-50 to-rose-100',
    iconColor: 'text-rose-600',
  },
  {
    title: 'Profile & Progress',
    description: 'Keep your skills, goals, learning, and achievements in one secure place.',
    icon: UserRound,
    route: '/profile',
    tone: 'from-indigo-50 to-indigo-100',
    iconColor: 'text-indigo-600',
  },
];

const steps = [
  {
    number: '01',
    title: 'Tell us about yourself',
    description: 'Share your skills, interests, budget, and goals in a few simple steps.',
    icon: UserRound,
  },
  {
    number: '02',
    title: 'Get a personal plan',
    description: 'Our AI recommends opportunities, courses, schemes, and buyers for you.',
    icon: Sparkles,
  },
  {
    number: '03',
    title: 'Learn, start, and grow',
    description: 'Take action with clear milestones and track your progress every day.',
    icon: TrendingUp,
  },
];

export function Welcome() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-b from-primary-50 via-white to-secondary-50">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-primary-100 blur-3xl opacity-60" />
        <div className="absolute right-0 top-40 h-80 w-80 rounded-full bg-secondary-100 blur-3xl opacity-50" />
      </div>

      {isAuthenticated ? <Header /> : (
      <header className="relative z-10 border-b border-gray-100/80 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/welcome')}
            className="flex items-center gap-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="RozgarSetu AI home"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-secondary-600 text-lg font-bold text-white shadow-lg shadow-primary-600/20">
              US
            </span>
            <span className="text-left">
              <span className="block text-base font-bold text-gray-900">RozgarSetu AI</span>
              <span className="block text-xs text-gray-500">Skill to sustainable income</span>
            </span>
          </button>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden items-center gap-1.5 rounded-full bg-secondary-50 px-3 py-1.5 text-xs font-medium text-secondary-700 sm:inline-flex">
              <ShieldCheck className="h-4 w-4" /> Built for India&apos;s makers
            </span>
            <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button size="sm" onClick={() => navigate('/register')} rightIcon={<ArrowRight className="h-4 w-4" />}>
              Get Started
            </Button>
          </div>
        </div>
      </header>
      )}

      <main className="relative z-10">
        <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-20 lg:px-8">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-100 bg-primary-50/80 px-3 py-1.5 text-xs font-semibold text-primary-700">
              <Sparkles className="mr-1.5 inline h-4 w-4" /> AI-powered livelihood companion
            </div>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Turn your skill into{' '}
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                sustainable income
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
              Discover opportunities, learn practical skills, plan your business, find funding, and connect with buyers — all in one simple Hindi-first platform.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" onClick={() => navigate('/register')} rightIcon={<ArrowRight className="h-5 w-5" />}>
                Start Your Journey
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/explore')}>
                Explore Opportunities
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <div>
                <p className="text-2xl font-bold text-gray-900">8+</p>
                <p className="text-xs font-medium text-gray-500">Growth tools</p>
              </div>
              <div className="h-9 w-px bg-gray-200" />
              <div>
                <p className="text-2xl font-bold text-gray-900">Hindi + English</p>
                <p className="text-xs font-medium text-gray-500">Easy to use</p>
              </div>
              <div className="h-9 w-px bg-gray-200" />
              <div>
                <p className="text-2xl font-bold text-gray-900">100%</p>
                <p className="text-xs font-medium text-gray-500">Personalized</p>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg lg:mx-0">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-primary-100 via-secondary-100 to-white opacity-80 blur-2xl" aria-hidden="true" />
            <div className="relative rounded-3xl border border-white bg-white p-4 shadow-2xl shadow-primary-900/10">
              <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-primary-600 to-secondary-600 p-5 text-white">
                <div>
                  <p className="text-xs font-medium text-primary-100">Today&apos;s progress</p>
                  <p className="mt-1 text-xl font-bold">Your next step is ready</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100">
                    <Lightbulb className="h-5 w-5 text-primary-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900">Custom Tailoring</p>
                    <p className="truncate text-xs text-gray-500">92% match · Low investment</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-gray-400" />
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary-100">
                    <BookOpen className="h-5 w-5 text-secondary-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900">Candle Making Business</p>
                    <p className="truncate text-xs text-gray-500">Lesson 3 · 18 min</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-gray-400" />
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900">PM Mudra Yojana</p>
                    <p className="truncate text-xs text-gray-500">Funding match · 88%</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              <div className="mt-4 rounded-2xl bg-primary-50 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-primary-700">
                  <Bot className="h-5 w-5" /> RozgarSetu AI Assistant
                </div>
                <p className="mt-2 text-sm leading-6 text-gray-600">Based on your tailoring skills, a home-based alteration service can start with ₹15,000.</p>
                <div className="mt-3 flex gap-2">
                  <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-primary-700 shadow-sm">View opportunity</span>
                  <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-gray-600 shadow-sm">Ask AI</span>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-5 -left-5 rounded-2xl border border-gray-100 bg-white p-3 shadow-xl shadow-lg">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-secondary-600" />
                <span className="text-sm font-semibold text-gray-900">Trusted by local entrepreneurs</span>
              </div>
            </div>
          </div>
        </section>

        {isAuthenticated && user && (
          <section className="bg-white/70 py-12 sm:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-3xl">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Your Profile</h2>
                <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
                  <div className="flex items-center gap-6 mb-6">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-secondary-600 text-3xl font-bold text-white shadow-lg">
                      {user.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{user.name}</h3>
                      <p className="text-gray-500">{user.phone}</p>
                      <p className="text-sm text-gray-400 mt-1">
                        {user.location?.state}, {user.location?.district}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {user.profile?.skills?.map((skill) => (
                          <span
                            key={skill.id}
                            className="inline-flex items-center rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-700"
                          >
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Available Capital</h4>
                      <p className="text-xl font-bold text-gray-900">
                        ₹{user.profile?.financialInfo?.availableCapital?.toLocaleString() || '0'}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Interests</h4>
                      <div className="flex flex-wrap gap-2">
                        {user.profile?.interests?.map((interest) => (
                          <span
                            key={interest.id}
                            className="inline-flex items-center rounded-full bg-secondary-100 px-3 py-1 text-sm font-medium text-secondary-700"
                          >
                            {interest.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Goals</h4>
                      <div className="flex flex-wrap gap-2">
                        {user.profile?.goals?.map((goal) => (
                          <span
                            key={goal.id}
                            className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700"
                          >
                            {goal.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <Button
                      variant="primary"
                      onClick={() => navigate('/profile')}
                      rightIcon={<ArrowRight className="h-4 w-4" />}
                    >
                      Edit Profile
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="bg-white/70 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-bold uppercase tracking-wider text-primary-600">One platform, every step</p>
              <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">Everything you need to grow</h2>
              <p className="mt-4 text-lg text-gray-600">Move from discovery to income with tools designed for real-world businesses.</p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <button
                    key={feature.title}
                    onClick={() => navigate(feature.route)}
                    className="group rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-primary-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.tone}`}>
                      <Icon className={`h-6 w-6 ${feature.iconColor}`} />
                    </div>
                    <h3 className="mt-4 text-base font-bold text-gray-900">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-gray-600">{feature.description}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600">
                      Open feature <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr]">
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-secondary-600">Simple by design</p>
                <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">A clear path from idea to income</h2>
                <p className="mt-4 text-lg leading-8 text-gray-600">No confusing dashboards. Just the next useful action, explained in your language.</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm border border-gray-100">
                    <Smartphone className="h-4 w-4 text-primary-600" /> Mobile friendly
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm border border-gray-100">
                    <HeartHandshake className="h-4 w-4 text-secondary-600" /> Made for rural India
                  </span>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {steps.map((step) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.number} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-primary-600">{step.number}</span>
                        <Icon className="h-5 w-5 text-gray-400" />
                      </div>
                      <h3 className="mt-6 text-base font-bold text-gray-900">{step.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-gray-600">{step.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-20 sm:px-6 lg:px-8">
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-r from-primary-700 via-primary-600 to-secondary-600 px-6 py-14 text-center shadow-2xl sm:px-12">
            <div className="absolute left-10 top-0 h-40 w-40 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />
            <div className="absolute bottom-0 right-10 h-48 w-48 rounded-full bg-secondary-300/20 blur-2xl" aria-hidden="true" />
            <h2 className="relative text-3xl font-bold text-white sm:text-4xl">Ready to build your future?</h2>
            <p className="relative mx-auto mt-3 max-w-2xl text-primary-100">Create your free account and get a personalized roadmap in minutes.</p>
            <div className="relative mt-8 flex justify-center gap-3">
              <Button variant="secondary" size="lg" onClick={() => navigate('/register')} rightIcon={<ArrowRight className="h-5 w-5" />}>
                Create Free Account
              </Button>
              <Button variant="outline" size="lg" className="border-white/60 !text-white hover:!bg-white/10 hover:!text-white" onClick={() => navigate('/login')}>
                I Already Have an Account
              </Button>
            </div>
          </div>
        </section>
      </main>

      <AIChatBot />

      {isAuthenticated && (
        <div className="fixed bottom-24 left-4 z-40 lg:bottom-6 lg:left-6">
          <VoiceButton
            size="lg"
            showStatus={false}
            onStartListening={() => {}}
            onStopListening={() => {}}
          />
        </div>
      )}

      <footer className="relative z-10 border-t border-gray-100 bg-white/70">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-gray-500 sm:flex-row sm:px-6 lg:px-8">
          <span>© {new Date().getFullYear()} RozgarSetu AI</span>
          <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-secondary-600" /> Your journey, your pace.</span>
        </div>
      </footer>
    </div>
  );
}
