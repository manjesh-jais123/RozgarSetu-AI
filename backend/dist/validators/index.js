"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.idParamSchema = exports.notificationIdSchema = exports.lessonRouteSchema = exports.mongoIdParamSchema = exports.mongoIdSchema = exports.paginationSchema = exports.notificationFiltersSchema = exports.learningPathFiltersSchema = exports.buyerFiltersSchema = exports.productFiltersSchema = exports.schemeFiltersSchema = exports.opportunityFiltersSchema = exports.aiTextToVoiceSchema = exports.aiVoiceToTextSchema = exports.aiMatchBuyersSchema = exports.aiProductPassportSchema = exports.aiProductCatalogSchema = exports.aiAnalyzeProductSchema = exports.aiBusinessPlanSchema = exports.aiAssessmentSchema = exports.aiQuizSchema = exports.aiLearningPlanSchema = exports.aiSimulateIncomeSchema = exports.aiDiscoverSchema = exports.aiRecommendSkillsSchema = exports.aiExplainSchema = exports.aiChatSchema = exports.createMarketRequestSchema = exports.createOrderSchema = exports.createBusinessPlanSchema = exports.updateProductSchema = exports.createProductSchema = exports.updateGoalsSchema = exports.updateFinancialSchema = exports.updateInterestsSchema = exports.updateSkillsSchema = exports.updateBasicInfoSchema = exports.updateProfileSchema = exports.resetPasswordSchema = exports.refreshTokenSchema = exports.resendOtpSchema = exports.verifyOtpSchema = exports.loginSchema = exports.registerSchema = exports.otpSchema = exports.phoneSchema = void 0;
const zod_1 = require("zod");
exports.phoneSchema = zod_1.z.string().min(10, 'Phone number must be at least 10 digits').regex(/^(\+91)?[6-9]\d{9}$/, 'Invalid phone number format');
exports.otpSchema = zod_1.z.string().length(6, 'OTP must be 6 digits').regex(/^\d+$/, 'OTP must be numeric');
exports.registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2, 'Name must be at least 2 characters').max(100),
        phone: exports.phoneSchema,
        language: zod_1.z.enum(['hi', 'en']).default('hi'),
    }),
});
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        phone: exports.phoneSchema,
    }),
});
exports.verifyOtpSchema = zod_1.z.object({
    body: zod_1.z.object({
        phone: exports.phoneSchema,
        otp: exports.otpSchema,
    }),
});
exports.resendOtpSchema = zod_1.z.object({
    body: zod_1.z.object({
        phone: exports.phoneSchema,
    }),
});
exports.refreshTokenSchema = zod_1.z.object({
    body: zod_1.z.object({
        refreshToken: zod_1.z.string().min(1, 'Refresh token is required'),
    }),
});
exports.resetPasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        phone: exports.phoneSchema,
        otp: exports.otpSchema,
        newPassword: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    }),
});
exports.updateProfileSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2).max(100).optional(),
        language: zod_1.z.enum(['hi', 'en']).optional(),
        avatar: zod_1.z.string().url().optional(),
    }),
});
exports.updateBasicInfoSchema = zod_1.z.object({
    body: zod_1.z.object({
        age: zod_1.z.number().min(13).max(100).optional(),
        gender: zod_1.z.enum(['male', 'female', 'other']).optional(),
        education: zod_1.z.string().optional(),
        workExperience: zod_1.z.string().optional(),
        location: zod_1.z.object({
            state: zod_1.z.string().optional(),
            district: zod_1.z.string().optional(),
            village: zod_1.z.string().optional(),
            pincode: zod_1.z.string().optional(),
        }).optional(),
    }),
});
exports.updateSkillsSchema = zod_1.z.object({
    body: zod_1.z.object({
        skills: zod_1.z.array(zod_1.z.object({
            name: zod_1.z.string().min(1),
            category: zod_1.z.string().min(1),
            proficiency: zod_1.z.enum(['beginner', 'intermediate', 'advanced']),
            yearsExperience: zod_1.z.number().min(0),
        })),
    }),
});
exports.updateInterestsSchema = zod_1.z.object({
    body: zod_1.z.object({
        interests: zod_1.z.array(zod_1.z.object({
            name: zod_1.z.string().min(1),
            category: zod_1.z.string().min(1),
        })),
        businessInterest: zod_1.z.array(zod_1.z.object({
            name: zod_1.z.string().min(1),
            category: zod_1.z.string().min(1),
            description: zod_1.z.string().min(1),
        })),
    }),
});
exports.updateFinancialSchema = zod_1.z.object({
    body: zod_1.z.object({
        availableCapital: zod_1.z.number().min(0).optional(),
        expectedIncome: zod_1.z.number().min(0).optional(),
        currentIncome: zod_1.z.number().min(0).optional(),
        investmentCapacity: zod_1.z.number().min(0).optional(),
    }),
});
exports.updateGoalsSchema = zod_1.z.object({
    body: zod_1.z.object({
        goals: zod_1.z.array(zod_1.z.object({
            name: zod_1.z.string().min(1),
            description: zod_1.z.string().min(1),
            category: zod_1.z.enum(['learn', 'start', 'grow', 'customers', 'funding']),
        })),
    }),
});
exports.createProductSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1).max(200),
        description: zod_1.z.string().min(1),
        category: zod_1.z.string().min(1),
        materials: zod_1.z.array(zod_1.z.string()).optional(),
        dimensions: zod_1.z.string().min(1),
        price: zod_1.z.number().min(0),
        minimumOrderQuantity: zod_1.z.number().min(1).default(1),
        productionCapacity: zod_1.z.number().min(0),
        images: zod_1.z.array(zod_1.z.string().url()).optional(),
        tags: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});
exports.updateProductSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID'),
    }),
    body: zod_1.z.object({
        name: zod_1.z.string().min(1).max(200).optional(),
        description: zod_1.z.string().min(1).optional(),
        category: zod_1.z.string().min(1).optional(),
        materials: zod_1.z.array(zod_1.z.string()).optional(),
        dimensions: zod_1.z.string().min(1).optional(),
        price: zod_1.z.number().min(0).optional(),
        minimumOrderQuantity: zod_1.z.number().min(1).optional(),
        productionCapacity: zod_1.z.number().min(0).optional(),
        images: zod_1.z.array(zod_1.z.string().url()).optional(),
        tags: zod_1.z.array(zod_1.z.string()).optional(),
        status: zod_1.z.enum(['draft', 'active', 'inactive']).optional(),
    }),
});
exports.createBusinessPlanSchema = zod_1.z.object({
    body: zod_1.z.object({
        idea: zod_1.z.string().min(1),
        requiredInvestment: zod_1.z.number().min(0),
        rawMaterials: zod_1.z.array(zod_1.z.string()).optional(),
        equipment: zod_1.z.array(zod_1.z.string()).optional(),
        operatingCost: zod_1.z.number().min(0),
        pricingStrategy: zod_1.z.object({
            costPrice: zod_1.z.number().min(0),
            sellingPrice: zod_1.z.number().min(0),
            margin: zod_1.z.number().min(0).max(100),
            wholesalePrice: zod_1.z.number().min(0).optional(),
        }),
        customerSegments: zod_1.z.array(zod_1.z.string()).optional(),
        marketingPlan: zod_1.z.array(zod_1.z.string()).optional(),
        riskFactors: zod_1.z.array(zod_1.z.string()).optional(),
        nextActions: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});
exports.createOrderSchema = zod_1.z.object({
    body: zod_1.z.object({
        buyerId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
        items: zod_1.z.array(zod_1.z.object({
            productId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/),
            productName: zod_1.z.string().min(1),
            quantity: zod_1.z.number().min(1),
            unitPrice: zod_1.z.number().min(0),
            totalPrice: zod_1.z.number().min(0),
        })).min(1),
        shippingAddress: zod_1.z.object({
            name: zod_1.z.string().min(1),
            phone: zod_1.z.string().min(1),
            address: zod_1.z.string().min(1),
            city: zod_1.z.string().min(1),
            state: zod_1.z.string().min(1),
            pincode: zod_1.z.string().min(1),
        }),
        paymentMethod: zod_1.z.string().optional(),
        notes: zod_1.z.string().optional(),
    }),
});
exports.createMarketRequestSchema = zod_1.z.object({
    body: zod_1.z.object({
        productId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
        buyerId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
        type: zod_1.z.enum(['connect', 'rfq', 'order']),
        message: zod_1.z.string().min(1),
        quantity: zod_1.z.number().min(1).optional(),
    }),
});
exports.aiChatSchema = zod_1.z.object({
    body: zod_1.z.object({
        message: zod_1.z.string().min(1).max(2000),
        context: zod_1.z.record(zod_1.z.unknown()).optional(),
    }),
});
exports.aiExplainSchema = zod_1.z.object({
    body: zod_1.z.object({
        topic: zod_1.z.string().min(1).max(500),
        language: zod_1.z.enum(['hi', 'en']),
        style: zod_1.z.enum(['simple', 'example', 'village']),
    }),
});
exports.aiRecommendSkillsSchema = zod_1.z.object({
    body: zod_1.z.object({
        skills: zod_1.z.array(zod_1.z.object({
            name: zod_1.z.string().min(1),
            category: zod_1.z.string().min(1),
            proficiency: zod_1.z.enum(['beginner', 'intermediate', 'advanced']),
            yearsExperience: zod_1.z.number().min(0),
        })).optional(),
        interests: zod_1.z.array(zod_1.z.object({
            name: zod_1.z.string().min(1),
            category: zod_1.z.string().min(1),
        })).optional(),
        businessInterest: zod_1.z.array(zod_1.z.object({
            name: zod_1.z.string().min(1),
            category: zod_1.z.string().min(1),
            description: zod_1.z.string().min(1),
        })).optional(),
        location: zod_1.z.object({
            state: zod_1.z.string().optional(),
            district: zod_1.z.string().optional(),
            village: zod_1.z.string().optional(),
            pincode: zod_1.z.string().optional(),
        }).optional(),
        goals: zod_1.z.array(zod_1.z.object({
            name: zod_1.z.string().min(1),
            description: zod_1.z.string().min(1),
            category: zod_1.z.enum(['learn', 'start', 'grow', 'customers', 'funding']),
        })).optional(),
    }),
});
exports.aiDiscoverSchema = zod_1.z.object({
    body: zod_1.z.object({
        query: zod_1.z.string().min(1).max(500),
    }),
});
exports.aiSimulateIncomeSchema = zod_1.z.object({
    body: zod_1.z.object({
        opportunity: zod_1.z.string().min(1).max(200),
        investment: zod_1.z.number().min(0).max(10000000),
    }),
});
exports.aiLearningPlanSchema = zod_1.z.object({
    body: zod_1.z.object({
        topic: zod_1.z.string().min(1).max(200),
        level: zod_1.z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
    }),
});
exports.aiQuizSchema = zod_1.z.object({
    body: zod_1.z.object({
        topic: zod_1.z.string().min(1).max(200),
        count: zod_1.z.number().min(1).max(20).default(5),
        level: zod_1.z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
    }),
});
exports.aiAssessmentSchema = zod_1.z.object({
    body: zod_1.z.object({
        answers: zod_1.z.array(zod_1.z.number().min(0).max(3)),
        questions: zod_1.z.array(zod_1.z.object({
            question: zod_1.z.string().min(1),
            options: zod_1.z.array(zod_1.z.string()).length(4),
            correctAnswer: zod_1.z.number().min(0).max(3),
            explanation: zod_1.z.string().optional(),
        })),
    }),
});
exports.aiBusinessPlanSchema = zod_1.z.object({
    body: zod_1.z.object({
        idea: zod_1.z.string().min(1).max(500),
    }),
});
exports.aiAnalyzeProductSchema = zod_1.z.object({
    body: zod_1.z.object({
        description: zod_1.z.string().min(1).max(1000),
    }),
});
exports.aiProductCatalogSchema = zod_1.z.object({
    body: zod_1.z.object({
        ideas: zod_1.z.array(zod_1.z.string().min(1).max(200)).min(1).max(10),
    }),
});
exports.aiProductPassportSchema = zod_1.z.object({
    body: zod_1.z.object({
        product: zod_1.z.record(zod_1.z.unknown()),
    }),
});
exports.aiMatchBuyersSchema = zod_1.z.object({
    body: zod_1.z.object({
        productInfo: zod_1.z.string().max(500).optional(),
    }),
});
exports.aiVoiceToTextSchema = zod_1.z.object({
    body: zod_1.z.object({
        audio: zod_1.z.string().min(1),
        language: zod_1.z.enum(['hi', 'en', 'hindi', 'english']).optional(),
    }),
});
exports.aiTextToVoiceSchema = zod_1.z.object({
    body: zod_1.z.object({
        text: zod_1.z.string().min(1).max(2000),
        language: zod_1.z.enum(['hi', 'en', 'hindi', 'english']).optional(),
        voice: zod_1.z.string().optional(),
        speed: zod_1.z.number().min(0.5).max(2).optional(),
    }),
});
exports.opportunityFiltersSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.coerce.number().min(1).default(1),
        limit: zod_1.z.coerce.number().min(1).max(50).default(10),
        category: zod_1.z.string().optional(),
        difficulty: zod_1.z.enum(['easy', 'medium', 'hard']).optional(),
        minInvestment: zod_1.z.coerce.number().min(0).optional(),
        maxInvestment: zod_1.z.coerce.number().min(0).optional(),
        skill: zod_1.z.string().optional(),
        location: zod_1.z.string().optional(),
        search: zod_1.z.string().optional(),
        sort: zod_1.z.enum(['matchPercentage', 'requiredInvestment', 'createdAt']).default('matchPercentage'),
        order: zod_1.z.enum(['asc', 'desc']).default('desc'),
    }),
});
exports.schemeFiltersSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.coerce.number().min(1).default(1),
        limit: zod_1.z.coerce.number().min(1).max(50).default(10),
        category: zod_1.z.string().optional(),
        search: zod_1.z.string().optional(),
    }),
});
exports.productFiltersSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.coerce.number().min(1).default(1),
        limit: zod_1.z.coerce.number().min(1).max(50).default(10),
        category: zod_1.z.string().optional(),
        status: zod_1.z.enum(['draft', 'active', 'inactive']).optional(),
        search: zod_1.z.string().optional(),
    }),
});
exports.buyerFiltersSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.coerce.number().min(1).default(1),
        limit: zod_1.z.coerce.number().min(1).max(50).default(10),
        type: zod_1.z.enum(['individual', 'business', 'wholesaler', 'retailer', 'exporter']).optional(),
        product: zod_1.z.string().optional(),
        location: zod_1.z.string().optional(),
        verified: zod_1.z.coerce.boolean().optional(),
        search: zod_1.z.string().optional(),
    }),
});
exports.learningPathFiltersSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.coerce.number().min(1).default(1),
        limit: zod_1.z.coerce.number().min(1).max(50).default(10),
        category: zod_1.z.string().optional(),
        difficulty: zod_1.z.enum(['beginner', 'intermediate', 'advanced']).optional(),
        search: zod_1.z.string().optional(),
    }),
});
exports.notificationFiltersSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.coerce.number().min(1).default(1),
        limit: zod_1.z.coerce.number().min(1).max(50).default(20),
        type: zod_1.z.string().optional(),
        isRead: zod_1.z.coerce.boolean().optional(),
    }),
});
exports.paginationSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.coerce.number().min(1).default(1),
        limit: zod_1.z.coerce.number().min(1).max(100).default(10),
        sort: zod_1.z.string().optional(),
        order: zod_1.z.enum(['asc', 'desc']).default('desc'),
    }),
});
exports.mongoIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format'),
    }),
});
exports.mongoIdParamSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format'),
    }),
});
exports.lessonRouteSchema = zod_1.z.object({
    params: zod_1.z.object({
        pathId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid path ID'),
        lessonId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid lesson ID'),
    }),
});
exports.notificationIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format'),
    }),
});
exports.idParamSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format'),
    }),
});
__exportStar(require("./admin"), exports);
//# sourceMappingURL=index.js.map