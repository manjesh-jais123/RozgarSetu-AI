import { z } from 'zod';

export const phoneSchema = z.string().min(10, 'Phone number must be at least 10 digits').regex(/^(\+91)?[6-9]\d{9}$/, 'Invalid phone number format');

export const otpSchema = z.string().length(6, 'OTP must be 6 digits').regex(/^\d+$/, 'OTP must be numeric');

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    phone: phoneSchema,
    language: z.enum(['hi', 'en']).default('hi'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    phone: phoneSchema,
  }),
});

export const verifyOtpSchema = z.object({
  body: z.object({
    phone: phoneSchema,
    otp: otpSchema,
  }),
});

export const resendOtpSchema = z.object({
  body: z.object({
    phone: phoneSchema,
  }),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    phone: phoneSchema,
    otp: otpSchema,
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    language: z.enum(['hi', 'en']).optional(),
    avatar: z.string().url().optional(),
  }),
});

export const updateBasicInfoSchema = z.object({
  body: z.object({
    age: z.number().min(13).max(100).optional(),
    gender: z.enum(['male', 'female', 'other']).optional(),
    education: z.string().optional(),
    workExperience: z.string().optional(),
    location: z.object({
      state: z.string().optional(),
      district: z.string().optional(),
      village: z.string().optional(),
      pincode: z.string().optional(),
    }).optional(),
  }),
});

export const updateSkillsSchema = z.object({
  body: z.object({
    skills: z.array(z.object({
      name: z.string().min(1),
      category: z.string().min(1),
      proficiency: z.enum(['beginner', 'intermediate', 'advanced']),
      yearsExperience: z.number().min(0),
    })),
  }),
});

export const updateInterestsSchema = z.object({
  body: z.object({
    interests: z.array(z.object({
      name: z.string().min(1),
      category: z.string().min(1),
    })),
    businessInterest: z.array(z.object({
      name: z.string().min(1),
      category: z.string().min(1),
      description: z.string().min(1),
    })),
  }),
});

export const updateFinancialSchema = z.object({
  body: z.object({
    availableCapital: z.number().min(0).optional(),
    expectedIncome: z.number().min(0).optional(),
    currentIncome: z.number().min(0).optional(),
    investmentCapacity: z.number().min(0).optional(),
  }),
});

export const updateGoalsSchema = z.object({
  body: z.object({
    goals: z.array(z.object({
      name: z.string().min(1),
      description: z.string().min(1),
      category: z.enum(['learn', 'start', 'grow', 'customers', 'funding']),
    })),
  }),
});

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(200),
    description: z.string().min(1),
    category: z.string().min(1),
    materials: z.array(z.string()).optional(),
    dimensions: z.string().min(1),
    price: z.number().min(0),
    minimumOrderQuantity: z.number().min(1).default(1),
    productionCapacity: z.number().min(0),
    images: z.array(z.string().url()).optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID'),
  }),
  body: z.object({
    name: z.string().min(1).max(200).optional(),
    description: z.string().min(1).optional(),
    category: z.string().min(1).optional(),
    materials: z.array(z.string()).optional(),
    dimensions: z.string().min(1).optional(),
    price: z.number().min(0).optional(),
    minimumOrderQuantity: z.number().min(1).optional(),
    productionCapacity: z.number().min(0).optional(),
    images: z.array(z.string().url()).optional(),
    tags: z.array(z.string()).optional(),
    status: z.enum(['draft', 'active', 'inactive']).optional(),
  }),
});

export const createBusinessPlanSchema = z.object({
  body: z.object({
    idea: z.string().min(1),
    requiredInvestment: z.number().min(0),
    rawMaterials: z.array(z.string()).optional(),
    equipment: z.array(z.string()).optional(),
    operatingCost: z.number().min(0),
    pricingStrategy: z.object({
      costPrice: z.number().min(0),
      sellingPrice: z.number().min(0),
      margin: z.number().min(0).max(100),
      wholesalePrice: z.number().min(0).optional(),
    }),
    customerSegments: z.array(z.string()).optional(),
    marketingPlan: z.array(z.string()).optional(),
    riskFactors: z.array(z.string()).optional(),
    nextActions: z.array(z.string()).optional(),
  }),
});

export const createOrderSchema = z.object({
  body: z.object({
    buyerId: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
    items: z.array(z.object({
      productId: z.string().regex(/^[0-9a-fA-F]{24}$/),
      productName: z.string().min(1),
      quantity: z.number().min(1),
      unitPrice: z.number().min(0),
      totalPrice: z.number().min(0),
    })).min(1),
    shippingAddress: z.object({
      name: z.string().min(1),
      phone: z.string().min(1),
      address: z.string().min(1),
      city: z.string().min(1),
      state: z.string().min(1),
      pincode: z.string().min(1),
    }),
    paymentMethod: z.string().optional(),
    notes: z.string().optional(),
  }),
});

export const createMarketRequestSchema = z.object({
  body: z.object({
    productId: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
    buyerId: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
    type: z.enum(['connect', 'rfq', 'order']),
    message: z.string().min(1),
    quantity: z.number().min(1).optional(),
  }),
});

export const aiChatSchema = z.object({
  body: z.object({
    message: z.string().min(1).max(2000),
    context: z.record(z.unknown()).optional(),
  }),
});

export const aiExplainSchema = z.object({
  body: z.object({
    topic: z.string().min(1).max(500),
    language: z.enum(['hi', 'en']),
    style: z.enum(['simple', 'example', 'village']),
  }),
});

export const aiRecommendSkillsSchema = z.object({
  body: z.object({
    skills: z.array(z.object({
      name: z.string().min(1),
      category: z.string().min(1),
      proficiency: z.enum(['beginner', 'intermediate', 'advanced']),
      yearsExperience: z.number().min(0),
    })).optional(),
    interests: z.array(z.object({
      name: z.string().min(1),
      category: z.string().min(1),
    })).optional(),
    businessInterest: z.array(z.object({
      name: z.string().min(1),
      category: z.string().min(1),
      description: z.string().min(1),
    })).optional(),
    location: z.object({
      state: z.string().optional(),
      district: z.string().optional(),
      village: z.string().optional(),
      pincode: z.string().optional(),
    }).optional(),
    goals: z.array(z.object({
      name: z.string().min(1),
      description: z.string().min(1),
      category: z.enum(['learn', 'start', 'grow', 'customers', 'funding']),
    })).optional(),
  }),
});

export const aiDiscoverSchema = z.object({
  body: z.object({
    query: z.string().min(1).max(500),
  }),
});

export const aiSimulateIncomeSchema = z.object({
  body: z.object({
    opportunity: z.string().min(1).max(200),
    investment: z.number().min(0).max(10000000),
  }),
});

export const aiLearningPlanSchema = z.object({
  body: z.object({
    topic: z.string().min(1).max(200),
    level: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
  }),
});

export const aiQuizSchema = z.object({
  body: z.object({
    topic: z.string().min(1).max(200),
    count: z.number().min(1).max(20).default(5),
    level: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
  }),
});

export const aiAssessmentSchema = z.object({
  body: z.object({
    answers: z.array(z.number().min(0).max(3)),
    questions: z.array(z.object({
      question: z.string().min(1),
      options: z.array(z.string()).length(4),
      correctAnswer: z.number().min(0).max(3),
      explanation: z.string().optional(),
    })),
  }),
});

export const aiBusinessPlanSchema = z.object({
  body: z.object({
    idea: z.string().min(1).max(500),
  }),
});

export const aiAnalyzeProductSchema = z.object({
  body: z.object({
    description: z.string().min(1).max(1000),
  }),
});

export const aiProductCatalogSchema = z.object({
  body: z.object({
    ideas: z.array(z.string().min(1).max(200)).min(1).max(10),
  }),
});

export const aiProductPassportSchema = z.object({
  body: z.object({
    product: z.record(z.unknown()),
  }),
});

export const aiMatchBuyersSchema = z.object({
  body: z.object({
    productInfo: z.string().max(500).optional(),
  }),
});

export const aiVoiceToTextSchema = z.object({
  body: z.object({
    audio: z.string().min(1),
    language: z.enum(['hi', 'en', 'hindi', 'english']).optional(),
  }),
});

export const aiTextToVoiceSchema = z.object({
  body: z.object({
    text: z.string().min(1).max(2000),
    language: z.enum(['hi', 'en', 'hindi', 'english']).optional(),
    voice: z.string().optional(),
    speed: z.number().min(0.5).max(2).optional(),
  }),
});

export const opportunityFiltersSchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(50).default(10),
    category: z.string().optional(),
    difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
    minInvestment: z.coerce.number().min(0).optional(),
    maxInvestment: z.coerce.number().min(0).optional(),
    skill: z.string().optional(),
    location: z.string().optional(),
    search: z.string().optional(),
    sort: z.enum(['matchPercentage', 'requiredInvestment', 'createdAt']).default('matchPercentage'),
    order: z.enum(['asc', 'desc']).default('desc'),
  }),
});

export const schemeFiltersSchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(50).default(10),
    category: z.string().optional(),
    search: z.string().optional(),
  }),
});

export const productFiltersSchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(50).default(10),
    category: z.string().optional(),
    status: z.enum(['draft', 'active', 'inactive']).optional(),
    search: z.string().optional(),
  }),
});

export const buyerFiltersSchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(50).default(10),
    type: z.enum(['individual', 'business', 'wholesaler', 'retailer', 'exporter']).optional(),
    product: z.string().optional(),
    location: z.string().optional(),
    verified: z.coerce.boolean().optional(),
    search: z.string().optional(),
  }),
});

export const learningPathFiltersSchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(50).default(10),
    category: z.string().optional(),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    search: z.string().optional(),
  }),
});

export const notificationFiltersSchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(50).default(20),
    type: z.string().optional(),
    isRead: z.coerce.boolean().optional(),
  }),
});

export const paginationSchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    sort: z.string().optional(),
    order: z.enum(['asc', 'desc']).default('desc'),
  }),
});

export const mongoIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format'),
  }),
});

export const mongoIdParamSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format'),
  }),
});

export const lessonRouteSchema = z.object({
  params: z.object({
    pathId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid path ID'),
    lessonId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid lesson ID'),
  }),
});

export const notificationIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format'),
  }),
});

export const idParamSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format'),
  }),
});

export * from './admin';