import { z } from 'zod';

const { z: zod } = require('zod');

export const adminPaginationSchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    sort: z.string().optional(),
    order: z.enum(['asc', 'desc']).default('desc'),
  }),
});

export const userFiltersSchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(50).default(10),
    role: z.enum(['USER', 'ADMIN', 'SUPER_ADMIN']).optional(),
    isActive: z.enum(['true', 'false']).optional(),
    onboardingCompleted: z.enum(['true', 'false']).optional(),
    state: z.string().optional(),
    district: z.string().optional(),
    search: z.string().optional(),
    sort: z.enum(['createdAt', 'name', 'lastLoginAt']).default('createdAt'),
    order: z.enum(['asc', 'desc']).default('desc'),
  }),
});

export const updateUserSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID'),
  }),
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    phone: z.string().min(10).optional(),
    email: z.string().email().optional(),
    role: z.enum(['USER', 'ADMIN', 'SUPER_ADMIN']).optional(),
    isActive: z.boolean().optional(),
    onboardingCompleted: z.boolean().optional(),
  }),
});

export const skillFiltersSchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(50).default(10),
    category: z.string().optional(),
    proficiency: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    isActive: z.enum(['true', 'false']).optional(),
    search: z.string().optional(),
  }),
});

export const createSkillSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Skill name is required').max(200),
    category: z.string().min(1, 'Category is required').max(100),
    proficiency: z.enum(['beginner', 'intermediate', 'advanced']),
    yearsExperience: z.number().min(0),
    description: z.string().max(1000).optional(),
    learningResourceUrl: z.string().url().optional(),
    isActive: z.boolean().default(true),
  }),
});

export const updateSkillSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid skill ID'),
  }),
  body: z.object({
    name: z.string().min(1).max(200).optional(),
    category: z.string().min(1).max(100).optional(),
    proficiency: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    yearsExperience: z.number().min(0).optional(),
    description: z.string().max(1000).optional(),
    learningResourceUrl: z.string().url().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const opportunityFiltersSchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(50).default(10),
    category: z.string().optional(),
    difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
    isActive: z.enum(['true', 'false']).optional(),
    search: z.string().optional(),
    sort: z.enum(['createdAt', 'matchPercentage', 'title']).default('createdAt'),
    order: z.enum(['asc', 'desc']).default('desc'),
  }),
});

export const createOpportunitySchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(200),
    description: z.string().min(1, 'Description is required'),
    category: z.string().min(1, 'Category is required'),
    requiredInvestment: z.object({
      min: z.number().min(0),
      max: z.number().min(0),
    }),
    requiredSkills: z.array(z.string()).optional(),
    learningDuration: z.string().min(1, 'Learning duration is required'),
    difficulty: z.enum(['easy', 'medium', 'hard']),
    incomeScenarios: z.object({
      conservative: z.number().min(0),
      expected: z.number().min(0),
      optimistic: z.number().min(0),
      currency: z.enum(['INR']),
      period: z.enum(['monthly', 'yearly']),
    }),
    customerSegments: z.array(z.string()).optional(),
    location: z.string().optional(),
    tags: z.array(z.string()).optional(),
    isActive: z.boolean().default(true),
  }),
});

export const updateOpportunitySchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid opportunity ID'),
  }),
  body: z.object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().min(1).optional(),
    category: z.string().min(1).optional(),
    requiredInvestment: z.object({
      min: z.number().min(0),
      max: z.number().min(0),
    }).optional(),
    requiredSkills: z.array(z.string()).optional(),
    learningDuration: z.string().min(1).optional(),
    difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
    incomeScenarios: z.object({
      conservative: z.number().min(0),
      expected: z.number().min(0),
      optimistic: z.number().min(0),
      currency: z.enum(['INR']),
      period: z.enum(['monthly', 'yearly']),
    }).optional(),
    customerSegments: z.array(z.string()).optional(),
    location: z.string().optional(),
    matchPercentage: z.number().min(0).max(100).optional(),
    tags: z.array(z.string()).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const learningPathFiltersSchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(50).default(10),
    category: z.string().optional(),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    isActive: z.enum(['true', 'false']).optional(),
    search: z.string().optional(),
  }),
});

export const createLearningPathSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(200),
    description: z.string().min(1, 'Description is required'),
    category: z.string().min(1, 'Category is required'),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
    estimatedDuration: z.string().min(1, 'Duration is required'),
    lessons: z.array(z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      videoUrl: z.string().url().optional(),
      thumbnail: z.string().optional(),
      duration: z.string().min(1),
      difficulty: z.enum(['easy', 'medium', 'hard']),
      order: z.number().min(0),
      keyPoints: z.array(z.string()),
      quiz: z.object({
        questions: z.array(z.object({
          question: z.string().min(1),
          options: z.array(z.string()).min(2),
          correctAnswer: z.number().min(0),
          explanation: z.string().optional(),
        })),
        passingScore: z.number().min(0).max(100).default(70),
      }).optional(),
      isActive: z.boolean().default(true),
    })).min(1, 'At least one lesson is required'),
    tags: z.array(z.string()).optional(),
    isActive: z.boolean().default(true),
  }),
});

export const updateLearningPathSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid learning path ID'),
  }),
  body: z.object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().min(1).optional(),
    category: z.string().min(1).optional(),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    estimatedDuration: z.string().min(1).optional(),
    lessons: z.array(z.object({
      title: z.string().min(1).optional(),
      description: z.string().min(1).optional(),
      videoUrl: z.string().url().optional(),
      thumbnail: z.string().optional(),
      duration: z.string().min(1).optional(),
      difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
      order: z.number().min(0).optional(),
      keyPoints: z.array(z.string()).optional(),
      isActive: z.boolean().optional(),
    })).optional(),
    tags: z.array(z.string()).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const lessonUpdateSchema = z.object({
  params: z.object({
    pathId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid path ID'),
    lessonId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid lesson ID'),
  }),
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    videoUrl: z.string().url().optional(),
    thumbnail: z.string().optional(),
    duration: z.string().min(1).optional(),
    difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
    order: z.number().min(0).optional(),
    keyPoints: z.array(z.string()).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const schemeFiltersSchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(50).default(10),
    category: z.string().optional(),
    isVerified: z.enum(['true', 'false']).optional(),
    isActive: z.enum(['true', 'false']).optional(),
    state: z.string().optional(),
    search: z.string().optional(),
  }),
});

export const createSchemeSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Scheme name is required').max(200),
    description: z.string().min(1, 'Description is required'),
    eligibility: z.array(z.string()).min(1, 'At least one eligibility criteria is required'),
    benefits: z.array(z.string()).min(1, 'At least one benefit is required'),
    requiredDocuments: z.array(z.string()).optional(),
    applicationProcess: z.array(z.string()).optional(),
    matchPercentage: z.number().min(0).max(100).default(0),
    category: z.string().min(1, 'Category is required'),
    deadline: z.string().datetime().optional(),
    officialWebsite: z.string().url().optional(),
    targetGroup: z.string().optional(),
    stateAvailability: z.array(z.string()).optional(),
    lastVerified: z.string().datetime().optional(),
    isVerified: z.boolean().default(false),
    isActive: z.boolean().default(true),
  }),
});

export const updateSchemeSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid scheme ID'),
  }),
  body: z.object({
    name: z.string().min(1).max(200).optional(),
    description: z.string().min(1).optional(),
    eligibility: z.array(z.string()).optional(),
    benefits: z.array(z.string()).optional(),
    requiredDocuments: z.array(z.string()).optional(),
    applicationProcess: z.array(z.string()).optional(),
    matchPercentage: z.number().min(0).max(100).optional(),
    category: z.string().min(1).optional(),
    deadline: z.string().datetime().optional(),
    officialWebsite: z.string().url().optional(),
    targetGroup: z.string().optional(),
    stateAvailability: z.array(z.string()).optional(),
    lastVerified: z.string().datetime().optional(),
    isVerified: z.boolean().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const productFiltersSchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(50).default(10),
    category: z.string().optional(),
    status: z.enum(['draft', 'active', 'inactive']).optional(),
    moderationStatus: z.enum(['pending', 'approved', 'rejected']).optional(),
    search: z.string().optional(),
  }),
});

export const productModerationSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID'),
  }),
  body: z.object({
    moderationStatus: z.enum(['pending', 'approved', 'rejected']),
    moderationNote: z.string().optional(),
    category: z.string().optional(),
    status: z.enum(['draft', 'active', 'inactive']).optional(),
  }),
});

export const buyerFiltersSchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(50).default(10),
    type: z.enum(['individual', 'business', 'wholesaler', 'retailer', 'exporter']).optional(),
    location: z.string().optional(),
    verified: z.enum(['true', 'false']).optional(),
    isActive: z.enum(['true', 'false']).optional(),
    search: z.string().optional(),
  }),
});

export const createBuyerSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Buyer name is required').max(200),
    type: z.enum(['individual', 'business', 'wholesaler', 'retailer', 'exporter']),
    location: z.string().min(1, 'Location is required'),
    requiredProduct: z.string().min(1, 'Required product is required'),
    quantity: z.number().min(1),
    budget: z.number().min(0),
    matchPercentage: z.number().min(0).max(100).default(0),
    contactInfo: z.object({
      phone: z.string().optional(),
      email: z.string().email().optional(),
      address: z.string().optional(),
    }).optional(),
    verified: z.boolean().default(false),
    isActive: z.boolean().default(true),
  }),
});

export const updateBuyerSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid buyer ID'),
  }),
  body: z.object({
    name: z.string().min(1).max(200).optional(),
    type: z.enum(['individual', 'business', 'wholesaler', 'retailer', 'exporter']).optional(),
    location: z.string().min(1).optional(),
    requiredProduct: z.string().min(1).optional(),
    quantity: z.number().min(1).optional(),
    budget: z.number().min(0).optional(),
    matchPercentage: z.number().min(0).max(100).optional(),
    contactInfo: z.object({
      phone: z.string().optional(),
      email: z.string().email().optional(),
      address: z.string().optional(),
    }).optional(),
    verified: z.boolean().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const marketRequestFiltersSchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(50).default(10),
    type: z.enum(['connect', 'rfq', 'order']).optional(),
    status: z.enum(['pending', 'accepted', 'rejected', 'completed']).optional(),
    search: z.string().optional(),
  }),
});

export const orderFiltersSchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(50).default(10),
    status: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned']).optional(),
    paymentStatus: z.enum(['pending', 'paid', 'partial', 'refunded', 'failed']).optional(),
    search: z.string().optional(),
  }),
});

export const auditLogFiltersSchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(50).default(10),
    action: z.enum(['create', 'update', 'delete', 'suspend', 'activate', 'approve', 'reject', 'verify', 'login', 'export', 'settings']).optional(),
    resource: z.string().optional(),
    adminId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid admin ID').optional(),
    dateFrom: z.string().datetime().optional(),
    dateTo: z.string().datetime().optional(),
  }),
});

export const analyticsSchema = z.object({
  query: z.object({
    period: z.enum(['7d', '30d', '90d', 'all']).default('30d'),
  }),
});
