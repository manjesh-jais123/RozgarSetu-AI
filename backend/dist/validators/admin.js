"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsSchema = exports.auditLogFiltersSchema = exports.orderFiltersSchema = exports.marketRequestFiltersSchema = exports.updateBuyerSchema = exports.createBuyerSchema = exports.buyerFiltersSchema = exports.productModerationSchema = exports.productFiltersSchema = exports.updateSchemeSchema = exports.createSchemeSchema = exports.schemeFiltersSchema = exports.lessonUpdateSchema = exports.updateLearningPathSchema = exports.createLearningPathSchema = exports.learningPathFiltersSchema = exports.updateOpportunitySchema = exports.createOpportunitySchema = exports.opportunityFiltersSchema = exports.updateSkillSchema = exports.createSkillSchema = exports.skillFiltersSchema = exports.updateUserSchema = exports.userFiltersSchema = exports.adminPaginationSchema = void 0;
const zod_1 = require("zod");
const { z: zod } = require('zod');
exports.adminPaginationSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.coerce.number().min(1).default(1),
        limit: zod_1.z.coerce.number().min(1).max(100).default(10),
        sort: zod_1.z.string().optional(),
        order: zod_1.z.enum(['asc', 'desc']).default('desc'),
    }),
});
exports.userFiltersSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.coerce.number().min(1).default(1),
        limit: zod_1.z.coerce.number().min(1).max(50).default(10),
        role: zod_1.z.enum(['USER', 'ADMIN', 'SUPER_ADMIN']).optional(),
        isActive: zod_1.z.enum(['true', 'false']).optional(),
        onboardingCompleted: zod_1.z.enum(['true', 'false']).optional(),
        state: zod_1.z.string().optional(),
        district: zod_1.z.string().optional(),
        search: zod_1.z.string().optional(),
        sort: zod_1.z.enum(['createdAt', 'name', 'lastLoginAt']).default('createdAt'),
        order: zod_1.z.enum(['asc', 'desc']).default('desc'),
    }),
});
exports.updateUserSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID'),
    }),
    body: zod_1.z.object({
        name: zod_1.z.string().min(2).max(100).optional(),
        phone: zod_1.z.string().min(10).optional(),
        email: zod_1.z.string().email().optional(),
        role: zod_1.z.enum(['USER', 'ADMIN', 'SUPER_ADMIN']).optional(),
        isActive: zod_1.z.boolean().optional(),
        onboardingCompleted: zod_1.z.boolean().optional(),
    }),
});
exports.skillFiltersSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.coerce.number().min(1).default(1),
        limit: zod_1.z.coerce.number().min(1).max(50).default(10),
        category: zod_1.z.string().optional(),
        proficiency: zod_1.z.enum(['beginner', 'intermediate', 'advanced']).optional(),
        isActive: zod_1.z.enum(['true', 'false']).optional(),
        search: zod_1.z.string().optional(),
    }),
});
exports.createSkillSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, 'Skill name is required').max(200),
        category: zod_1.z.string().min(1, 'Category is required').max(100),
        proficiency: zod_1.z.enum(['beginner', 'intermediate', 'advanced']),
        yearsExperience: zod_1.z.number().min(0),
        description: zod_1.z.string().max(1000).optional(),
        learningResourceUrl: zod_1.z.string().url().optional(),
        isActive: zod_1.z.boolean().default(true),
    }),
});
exports.updateSkillSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid skill ID'),
    }),
    body: zod_1.z.object({
        name: zod_1.z.string().min(1).max(200).optional(),
        category: zod_1.z.string().min(1).max(100).optional(),
        proficiency: zod_1.z.enum(['beginner', 'intermediate', 'advanced']).optional(),
        yearsExperience: zod_1.z.number().min(0).optional(),
        description: zod_1.z.string().max(1000).optional(),
        learningResourceUrl: zod_1.z.string().url().optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
exports.opportunityFiltersSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.coerce.number().min(1).default(1),
        limit: zod_1.z.coerce.number().min(1).max(50).default(10),
        category: zod_1.z.string().optional(),
        difficulty: zod_1.z.enum(['easy', 'medium', 'hard']).optional(),
        isActive: zod_1.z.enum(['true', 'false']).optional(),
        search: zod_1.z.string().optional(),
        sort: zod_1.z.enum(['createdAt', 'matchPercentage', 'title']).default('createdAt'),
        order: zod_1.z.enum(['asc', 'desc']).default('desc'),
    }),
});
exports.createOpportunitySchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1, 'Title is required').max(200),
        description: zod_1.z.string().min(1, 'Description is required'),
        category: zod_1.z.string().min(1, 'Category is required'),
        requiredInvestment: zod_1.z.object({
            min: zod_1.z.number().min(0),
            max: zod_1.z.number().min(0),
        }),
        requiredSkills: zod_1.z.array(zod_1.z.string()).optional(),
        learningDuration: zod_1.z.string().min(1, 'Learning duration is required'),
        difficulty: zod_1.z.enum(['easy', 'medium', 'hard']),
        incomeScenarios: zod_1.z.object({
            conservative: zod_1.z.number().min(0),
            expected: zod_1.z.number().min(0),
            optimistic: zod_1.z.number().min(0),
            currency: zod_1.z.enum(['INR']),
            period: zod_1.z.enum(['monthly', 'yearly']),
        }),
        customerSegments: zod_1.z.array(zod_1.z.string()).optional(),
        location: zod_1.z.string().optional(),
        tags: zod_1.z.array(zod_1.z.string()).optional(),
        isActive: zod_1.z.boolean().default(true),
    }),
});
exports.updateOpportunitySchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid opportunity ID'),
    }),
    body: zod_1.z.object({
        title: zod_1.z.string().min(1).max(200).optional(),
        description: zod_1.z.string().min(1).optional(),
        category: zod_1.z.string().min(1).optional(),
        requiredInvestment: zod_1.z.object({
            min: zod_1.z.number().min(0),
            max: zod_1.z.number().min(0),
        }).optional(),
        requiredSkills: zod_1.z.array(zod_1.z.string()).optional(),
        learningDuration: zod_1.z.string().min(1).optional(),
        difficulty: zod_1.z.enum(['easy', 'medium', 'hard']).optional(),
        incomeScenarios: zod_1.z.object({
            conservative: zod_1.z.number().min(0),
            expected: zod_1.z.number().min(0),
            optimistic: zod_1.z.number().min(0),
            currency: zod_1.z.enum(['INR']),
            period: zod_1.z.enum(['monthly', 'yearly']),
        }).optional(),
        customerSegments: zod_1.z.array(zod_1.z.string()).optional(),
        location: zod_1.z.string().optional(),
        matchPercentage: zod_1.z.number().min(0).max(100).optional(),
        tags: zod_1.z.array(zod_1.z.string()).optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
exports.learningPathFiltersSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.coerce.number().min(1).default(1),
        limit: zod_1.z.coerce.number().min(1).max(50).default(10),
        category: zod_1.z.string().optional(),
        difficulty: zod_1.z.enum(['beginner', 'intermediate', 'advanced']).optional(),
        isActive: zod_1.z.enum(['true', 'false']).optional(),
        search: zod_1.z.string().optional(),
    }),
});
exports.createLearningPathSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1, 'Title is required').max(200),
        description: zod_1.z.string().min(1, 'Description is required'),
        category: zod_1.z.string().min(1, 'Category is required'),
        difficulty: zod_1.z.enum(['beginner', 'intermediate', 'advanced']),
        estimatedDuration: zod_1.z.string().min(1, 'Duration is required'),
        lessons: zod_1.z.array(zod_1.z.object({
            title: zod_1.z.string().min(1),
            description: zod_1.z.string().min(1),
            videoUrl: zod_1.z.string().url().optional(),
            thumbnail: zod_1.z.string().optional(),
            duration: zod_1.z.string().min(1),
            difficulty: zod_1.z.enum(['easy', 'medium', 'hard']),
            order: zod_1.z.number().min(0),
            keyPoints: zod_1.z.array(zod_1.z.string()),
            quiz: zod_1.z.object({
                questions: zod_1.z.array(zod_1.z.object({
                    question: zod_1.z.string().min(1),
                    options: zod_1.z.array(zod_1.z.string()).min(2),
                    correctAnswer: zod_1.z.number().min(0),
                    explanation: zod_1.z.string().optional(),
                })),
                passingScore: zod_1.z.number().min(0).max(100).default(70),
            }).optional(),
            isActive: zod_1.z.boolean().default(true),
        })).min(1, 'At least one lesson is required'),
        tags: zod_1.z.array(zod_1.z.string()).optional(),
        isActive: zod_1.z.boolean().default(true),
    }),
});
exports.updateLearningPathSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid learning path ID'),
    }),
    body: zod_1.z.object({
        title: zod_1.z.string().min(1).max(200).optional(),
        description: zod_1.z.string().min(1).optional(),
        category: zod_1.z.string().min(1).optional(),
        difficulty: zod_1.z.enum(['beginner', 'intermediate', 'advanced']).optional(),
        estimatedDuration: zod_1.z.string().min(1).optional(),
        lessons: zod_1.z.array(zod_1.z.object({
            title: zod_1.z.string().min(1).optional(),
            description: zod_1.z.string().min(1).optional(),
            videoUrl: zod_1.z.string().url().optional(),
            thumbnail: zod_1.z.string().optional(),
            duration: zod_1.z.string().min(1).optional(),
            difficulty: zod_1.z.enum(['easy', 'medium', 'hard']).optional(),
            order: zod_1.z.number().min(0).optional(),
            keyPoints: zod_1.z.array(zod_1.z.string()).optional(),
            isActive: zod_1.z.boolean().optional(),
        })).optional(),
        tags: zod_1.z.array(zod_1.z.string()).optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
exports.lessonUpdateSchema = zod_1.z.object({
    params: zod_1.z.object({
        pathId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid path ID'),
        lessonId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid lesson ID'),
    }),
    body: zod_1.z.object({
        title: zod_1.z.string().min(1).optional(),
        description: zod_1.z.string().min(1).optional(),
        videoUrl: zod_1.z.string().url().optional(),
        thumbnail: zod_1.z.string().optional(),
        duration: zod_1.z.string().min(1).optional(),
        difficulty: zod_1.z.enum(['easy', 'medium', 'hard']).optional(),
        order: zod_1.z.number().min(0).optional(),
        keyPoints: zod_1.z.array(zod_1.z.string()).optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
exports.schemeFiltersSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.coerce.number().min(1).default(1),
        limit: zod_1.z.coerce.number().min(1).max(50).default(10),
        category: zod_1.z.string().optional(),
        isVerified: zod_1.z.enum(['true', 'false']).optional(),
        isActive: zod_1.z.enum(['true', 'false']).optional(),
        state: zod_1.z.string().optional(),
        search: zod_1.z.string().optional(),
    }),
});
exports.createSchemeSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, 'Scheme name is required').max(200),
        description: zod_1.z.string().min(1, 'Description is required'),
        eligibility: zod_1.z.array(zod_1.z.string()).min(1, 'At least one eligibility criteria is required'),
        benefits: zod_1.z.array(zod_1.z.string()).min(1, 'At least one benefit is required'),
        requiredDocuments: zod_1.z.array(zod_1.z.string()).optional(),
        applicationProcess: zod_1.z.array(zod_1.z.string()).optional(),
        matchPercentage: zod_1.z.number().min(0).max(100).default(0),
        category: zod_1.z.string().min(1, 'Category is required'),
        deadline: zod_1.z.string().datetime().optional(),
        officialWebsite: zod_1.z.string().url().optional(),
        targetGroup: zod_1.z.string().optional(),
        stateAvailability: zod_1.z.array(zod_1.z.string()).optional(),
        lastVerified: zod_1.z.string().datetime().optional(),
        isVerified: zod_1.z.boolean().default(false),
        isActive: zod_1.z.boolean().default(true),
    }),
});
exports.updateSchemeSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid scheme ID'),
    }),
    body: zod_1.z.object({
        name: zod_1.z.string().min(1).max(200).optional(),
        description: zod_1.z.string().min(1).optional(),
        eligibility: zod_1.z.array(zod_1.z.string()).optional(),
        benefits: zod_1.z.array(zod_1.z.string()).optional(),
        requiredDocuments: zod_1.z.array(zod_1.z.string()).optional(),
        applicationProcess: zod_1.z.array(zod_1.z.string()).optional(),
        matchPercentage: zod_1.z.number().min(0).max(100).optional(),
        category: zod_1.z.string().min(1).optional(),
        deadline: zod_1.z.string().datetime().optional(),
        officialWebsite: zod_1.z.string().url().optional(),
        targetGroup: zod_1.z.string().optional(),
        stateAvailability: zod_1.z.array(zod_1.z.string()).optional(),
        lastVerified: zod_1.z.string().datetime().optional(),
        isVerified: zod_1.z.boolean().optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
exports.productFiltersSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.coerce.number().min(1).default(1),
        limit: zod_1.z.coerce.number().min(1).max(50).default(10),
        category: zod_1.z.string().optional(),
        status: zod_1.z.enum(['draft', 'active', 'inactive']).optional(),
        moderationStatus: zod_1.z.enum(['pending', 'approved', 'rejected']).optional(),
        search: zod_1.z.string().optional(),
    }),
});
exports.productModerationSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID'),
    }),
    body: zod_1.z.object({
        moderationStatus: zod_1.z.enum(['pending', 'approved', 'rejected']),
        moderationNote: zod_1.z.string().optional(),
        category: zod_1.z.string().optional(),
        status: zod_1.z.enum(['draft', 'active', 'inactive']).optional(),
    }),
});
exports.buyerFiltersSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.coerce.number().min(1).default(1),
        limit: zod_1.z.coerce.number().min(1).max(50).default(10),
        type: zod_1.z.enum(['individual', 'business', 'wholesaler', 'retailer', 'exporter']).optional(),
        location: zod_1.z.string().optional(),
        verified: zod_1.z.enum(['true', 'false']).optional(),
        isActive: zod_1.z.enum(['true', 'false']).optional(),
        search: zod_1.z.string().optional(),
    }),
});
exports.createBuyerSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, 'Buyer name is required').max(200),
        type: zod_1.z.enum(['individual', 'business', 'wholesaler', 'retailer', 'exporter']),
        location: zod_1.z.string().min(1, 'Location is required'),
        requiredProduct: zod_1.z.string().min(1, 'Required product is required'),
        quantity: zod_1.z.number().min(1),
        budget: zod_1.z.number().min(0),
        matchPercentage: zod_1.z.number().min(0).max(100).default(0),
        contactInfo: zod_1.z.object({
            phone: zod_1.z.string().optional(),
            email: zod_1.z.string().email().optional(),
            address: zod_1.z.string().optional(),
        }).optional(),
        verified: zod_1.z.boolean().default(false),
        isActive: zod_1.z.boolean().default(true),
    }),
});
exports.updateBuyerSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid buyer ID'),
    }),
    body: zod_1.z.object({
        name: zod_1.z.string().min(1).max(200).optional(),
        type: zod_1.z.enum(['individual', 'business', 'wholesaler', 'retailer', 'exporter']).optional(),
        location: zod_1.z.string().min(1).optional(),
        requiredProduct: zod_1.z.string().min(1).optional(),
        quantity: zod_1.z.number().min(1).optional(),
        budget: zod_1.z.number().min(0).optional(),
        matchPercentage: zod_1.z.number().min(0).max(100).optional(),
        contactInfo: zod_1.z.object({
            phone: zod_1.z.string().optional(),
            email: zod_1.z.string().email().optional(),
            address: zod_1.z.string().optional(),
        }).optional(),
        verified: zod_1.z.boolean().optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
exports.marketRequestFiltersSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.coerce.number().min(1).default(1),
        limit: zod_1.z.coerce.number().min(1).max(50).default(10),
        type: zod_1.z.enum(['connect', 'rfq', 'order']).optional(),
        status: zod_1.z.enum(['pending', 'accepted', 'rejected', 'completed']).optional(),
        search: zod_1.z.string().optional(),
    }),
});
exports.orderFiltersSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.coerce.number().min(1).default(1),
        limit: zod_1.z.coerce.number().min(1).max(50).default(10),
        status: zod_1.z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned']).optional(),
        paymentStatus: zod_1.z.enum(['pending', 'paid', 'partial', 'refunded', 'failed']).optional(),
        search: zod_1.z.string().optional(),
    }),
});
exports.auditLogFiltersSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.coerce.number().min(1).default(1),
        limit: zod_1.z.coerce.number().min(1).max(50).default(10),
        action: zod_1.z.enum(['create', 'update', 'delete', 'suspend', 'activate', 'approve', 'reject', 'verify', 'login', 'export', 'settings']).optional(),
        resource: zod_1.z.string().optional(),
        adminId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid admin ID').optional(),
        dateFrom: zod_1.z.string().datetime().optional(),
        dateTo: zod_1.z.string().datetime().optional(),
    }),
});
exports.analyticsSchema = zod_1.z.object({
    query: zod_1.z.object({
        period: zod_1.z.enum(['7d', '30d', '90d', 'all']).default('30d'),
    }),
});
//# sourceMappingURL=admin.js.map