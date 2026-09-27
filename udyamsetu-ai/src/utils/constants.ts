export const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', flag: '🇮🇳' },
] as const;

export const STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
] as const;

export const SKILL_CATEGORIES = [
  'Handicrafts & Artisans',
  'Food Processing',
  'Textile & Tailoring',
  'Agriculture & Farming',
  'Bamboo & Cane',
  'Pottery & Ceramics',
  'Woodwork & Carpentry',
  'Digital Services',
  'Beauty & Wellness',
  'Automotive Repair',
  'Electrical & Electronics',
  'Construction & Masonry',
  'Retail & Sales',
  'Hospitality & Tourism',
  'Healthcare Support',
] as const;

export const BUSINESS_CATEGORIES = [
  'Candle Making',
  'Bamboo Craft',
  'Tailoring & Stitching',
  'Food Processing',
  'Handicrafts',
  'Farming Related',
  'Digital Services',
  'Beauty Services',
  'Organic Farming',
  'Dairy & Poultry',
  'Spice Processing',
  'Pickle Making',
  'Paper Products',
  'Jute Products',
  'Terracotta',
] as const;

export const GOAL_CATEGORIES = [
  { id: 'learn', label: 'Learn a New Skill', description: 'Acquire new skills for livelihood' },
  { id: 'start', label: 'Start a Business', description: 'Begin your entrepreneurial journey' },
  { id: 'grow', label: 'Grow Existing Business', description: 'Scale and expand your current business' },
  { id: 'customers', label: 'Find Customers', description: 'Connect with buyers and markets' },
  { id: 'funding', label: 'Find Funding', description: 'Access schemes, loans and grants' },
] as const;

export const DIFFICULTY_LEVELS = [
  { value: 'easy', label: 'Easy', color: 'bg-green-100 text-green-700' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'hard', label: 'Hard', color: 'bg-red-100 text-red-700' },
] as const;

export const INCOME_PERIODS = [
  { value: 'monthly', label: 'Per Month' },
  { value: 'yearly', label: 'Per Year' },
] as const;

export const ONBOARDING_STEPS = [
  { id: 1, title: 'Basic Information', description: 'Name, age, location details' },
  { id: 2, title: 'Skills & Experience', description: 'Your skills, work, education' },
  { id: 3, title: 'Business Interest', description: 'What business interests you' },
  { id: 4, title: 'Financial Info', description: 'Budget, income, investment' },
  { id: 5, title: 'Goals', description: 'What you want to achieve' },
] as const;

export const ROADMAP_STEPS = [
  { id: 'interest', label: 'Interest', description: 'Discover your interests' },
  { id: 'learn', label: 'Learn', description: 'Acquire necessary skills' },
  { id: 'practice', label: 'Practice', description: 'Apply what you learned' },
  { id: 'assess', label: 'Assess', description: 'Test your knowledge' },
  { id: 'plan', label: 'Plan', description: 'Create your business plan' },
  { id: 'fund', label: 'Fund', description: 'Secure funding & resources' },
  { id: 'sell', label: 'Sell', description: 'Start selling your products' },
  { id: 'grow', label: 'Grow', description: 'Scale and expand' },
] as const;

export const PRODUCT_CATEGORIES = [
  'Handicrafts',
  'Food Products',
  'Textiles',
  'Bamboo Products',
  'Pottery',
  'Woodwork',
  'Organic Produce',
  'Spices & Condiments',
  'Personal Care',
  'Home Decor',
  'Accessories',
  'Stationery',
] as const;

export const BUYER_TYPES = [
  { value: 'individual', label: 'Individual Buyer' },
  { value: 'business', label: 'Business' },
  { value: 'wholesaler', label: 'Wholesaler' },
  { value: 'retailer', label: 'Retailer' },
  { value: 'exporter', label: 'Exporter' },
] as const;

export const SCHEME_CATEGORIES = [
  'Central Government',
  'State Government',
  'District Level',
  'Bank Loans',
  'NGO/Foundation',
  'CSR Programs',
] as const;