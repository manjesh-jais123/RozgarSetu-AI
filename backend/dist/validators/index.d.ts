import { z } from 'zod';
export declare const phoneSchema: z.ZodString;
export declare const otpSchema: z.ZodString;
export declare const registerSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        phone: z.ZodString;
        language: z.ZodDefault<z.ZodEnum<["hi", "en"]>>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        phone: string;
        language: "hi" | "en";
    }, {
        name: string;
        phone: string;
        language?: "hi" | "en" | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        name: string;
        phone: string;
        language: "hi" | "en";
    };
}, {
    body: {
        name: string;
        phone: string;
        language?: "hi" | "en" | undefined;
    };
}>;
export declare const loginSchema: z.ZodObject<{
    body: z.ZodObject<{
        phone: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        phone: string;
    }, {
        phone: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        phone: string;
    };
}, {
    body: {
        phone: string;
    };
}>;
export declare const verifyOtpSchema: z.ZodObject<{
    body: z.ZodObject<{
        phone: z.ZodString;
        otp: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        phone: string;
        otp: string;
    }, {
        phone: string;
        otp: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        phone: string;
        otp: string;
    };
}, {
    body: {
        phone: string;
        otp: string;
    };
}>;
export declare const resendOtpSchema: z.ZodObject<{
    body: z.ZodObject<{
        phone: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        phone: string;
    }, {
        phone: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        phone: string;
    };
}, {
    body: {
        phone: string;
    };
}>;
export declare const refreshTokenSchema: z.ZodObject<{
    body: z.ZodObject<{
        refreshToken: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        refreshToken: string;
    }, {
        refreshToken: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        refreshToken: string;
    };
}, {
    body: {
        refreshToken: string;
    };
}>;
export declare const resetPasswordSchema: z.ZodObject<{
    body: z.ZodObject<{
        phone: z.ZodString;
        otp: z.ZodString;
        newPassword: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        phone: string;
        otp: string;
        newPassword: string;
    }, {
        phone: string;
        otp: string;
        newPassword: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        phone: string;
        otp: string;
        newPassword: string;
    };
}, {
    body: {
        phone: string;
        otp: string;
        newPassword: string;
    };
}>;
export declare const updateProfileSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        language: z.ZodOptional<z.ZodEnum<["hi", "en"]>>;
        avatar: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name?: string | undefined;
        language?: "hi" | "en" | undefined;
        avatar?: string | undefined;
    }, {
        name?: string | undefined;
        language?: "hi" | "en" | undefined;
        avatar?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        name?: string | undefined;
        language?: "hi" | "en" | undefined;
        avatar?: string | undefined;
    };
}, {
    body: {
        name?: string | undefined;
        language?: "hi" | "en" | undefined;
        avatar?: string | undefined;
    };
}>;
export declare const updateBasicInfoSchema: z.ZodObject<{
    body: z.ZodObject<{
        age: z.ZodOptional<z.ZodNumber>;
        gender: z.ZodOptional<z.ZodEnum<["male", "female", "other"]>>;
        education: z.ZodOptional<z.ZodString>;
        workExperience: z.ZodOptional<z.ZodString>;
        location: z.ZodOptional<z.ZodObject<{
            state: z.ZodOptional<z.ZodString>;
            district: z.ZodOptional<z.ZodString>;
            village: z.ZodOptional<z.ZodString>;
            pincode: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            state?: string | undefined;
            district?: string | undefined;
            village?: string | undefined;
            pincode?: string | undefined;
        }, {
            state?: string | undefined;
            district?: string | undefined;
            village?: string | undefined;
            pincode?: string | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        age?: number | undefined;
        gender?: "male" | "female" | "other" | undefined;
        education?: string | undefined;
        workExperience?: string | undefined;
        location?: {
            state?: string | undefined;
            district?: string | undefined;
            village?: string | undefined;
            pincode?: string | undefined;
        } | undefined;
    }, {
        age?: number | undefined;
        gender?: "male" | "female" | "other" | undefined;
        education?: string | undefined;
        workExperience?: string | undefined;
        location?: {
            state?: string | undefined;
            district?: string | undefined;
            village?: string | undefined;
            pincode?: string | undefined;
        } | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        age?: number | undefined;
        gender?: "male" | "female" | "other" | undefined;
        education?: string | undefined;
        workExperience?: string | undefined;
        location?: {
            state?: string | undefined;
            district?: string | undefined;
            village?: string | undefined;
            pincode?: string | undefined;
        } | undefined;
    };
}, {
    body: {
        age?: number | undefined;
        gender?: "male" | "female" | "other" | undefined;
        education?: string | undefined;
        workExperience?: string | undefined;
        location?: {
            state?: string | undefined;
            district?: string | undefined;
            village?: string | undefined;
            pincode?: string | undefined;
        } | undefined;
    };
}>;
export declare const updateSkillsSchema: z.ZodObject<{
    body: z.ZodObject<{
        skills: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            category: z.ZodString;
            proficiency: z.ZodEnum<["beginner", "intermediate", "advanced"]>;
            yearsExperience: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            name: string;
            category: string;
            proficiency: "beginner" | "intermediate" | "advanced";
            yearsExperience: number;
        }, {
            name: string;
            category: string;
            proficiency: "beginner" | "intermediate" | "advanced";
            yearsExperience: number;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        skills: {
            name: string;
            category: string;
            proficiency: "beginner" | "intermediate" | "advanced";
            yearsExperience: number;
        }[];
    }, {
        skills: {
            name: string;
            category: string;
            proficiency: "beginner" | "intermediate" | "advanced";
            yearsExperience: number;
        }[];
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        skills: {
            name: string;
            category: string;
            proficiency: "beginner" | "intermediate" | "advanced";
            yearsExperience: number;
        }[];
    };
}, {
    body: {
        skills: {
            name: string;
            category: string;
            proficiency: "beginner" | "intermediate" | "advanced";
            yearsExperience: number;
        }[];
    };
}>;
export declare const updateInterestsSchema: z.ZodObject<{
    body: z.ZodObject<{
        interests: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            category: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: string;
            category: string;
        }, {
            name: string;
            category: string;
        }>, "many">;
        businessInterest: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            category: z.ZodString;
            description: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: string;
            category: string;
            description: string;
        }, {
            name: string;
            category: string;
            description: string;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        interests: {
            name: string;
            category: string;
        }[];
        businessInterest: {
            name: string;
            category: string;
            description: string;
        }[];
    }, {
        interests: {
            name: string;
            category: string;
        }[];
        businessInterest: {
            name: string;
            category: string;
            description: string;
        }[];
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        interests: {
            name: string;
            category: string;
        }[];
        businessInterest: {
            name: string;
            category: string;
            description: string;
        }[];
    };
}, {
    body: {
        interests: {
            name: string;
            category: string;
        }[];
        businessInterest: {
            name: string;
            category: string;
            description: string;
        }[];
    };
}>;
export declare const updateFinancialSchema: z.ZodObject<{
    body: z.ZodObject<{
        availableCapital: z.ZodOptional<z.ZodNumber>;
        expectedIncome: z.ZodOptional<z.ZodNumber>;
        currentIncome: z.ZodOptional<z.ZodNumber>;
        investmentCapacity: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        availableCapital?: number | undefined;
        expectedIncome?: number | undefined;
        currentIncome?: number | undefined;
        investmentCapacity?: number | undefined;
    }, {
        availableCapital?: number | undefined;
        expectedIncome?: number | undefined;
        currentIncome?: number | undefined;
        investmentCapacity?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        availableCapital?: number | undefined;
        expectedIncome?: number | undefined;
        currentIncome?: number | undefined;
        investmentCapacity?: number | undefined;
    };
}, {
    body: {
        availableCapital?: number | undefined;
        expectedIncome?: number | undefined;
        currentIncome?: number | undefined;
        investmentCapacity?: number | undefined;
    };
}>;
export declare const updateGoalsSchema: z.ZodObject<{
    body: z.ZodObject<{
        goals: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            description: z.ZodString;
            category: z.ZodEnum<["learn", "start", "grow", "customers", "funding"]>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            category: "learn" | "start" | "grow" | "customers" | "funding";
            description: string;
        }, {
            name: string;
            category: "learn" | "start" | "grow" | "customers" | "funding";
            description: string;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        goals: {
            name: string;
            category: "learn" | "start" | "grow" | "customers" | "funding";
            description: string;
        }[];
    }, {
        goals: {
            name: string;
            category: "learn" | "start" | "grow" | "customers" | "funding";
            description: string;
        }[];
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        goals: {
            name: string;
            category: "learn" | "start" | "grow" | "customers" | "funding";
            description: string;
        }[];
    };
}, {
    body: {
        goals: {
            name: string;
            category: "learn" | "start" | "grow" | "customers" | "funding";
            description: string;
        }[];
    };
}>;
export declare const createProductSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        description: z.ZodString;
        category: z.ZodString;
        materials: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        dimensions: z.ZodString;
        price: z.ZodNumber;
        minimumOrderQuantity: z.ZodDefault<z.ZodNumber>;
        productionCapacity: z.ZodNumber;
        images: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        category: string;
        description: string;
        dimensions: string;
        price: number;
        minimumOrderQuantity: number;
        productionCapacity: number;
        tags?: string[] | undefined;
        materials?: string[] | undefined;
        images?: string[] | undefined;
    }, {
        name: string;
        category: string;
        description: string;
        dimensions: string;
        price: number;
        productionCapacity: number;
        tags?: string[] | undefined;
        materials?: string[] | undefined;
        minimumOrderQuantity?: number | undefined;
        images?: string[] | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        name: string;
        category: string;
        description: string;
        dimensions: string;
        price: number;
        minimumOrderQuantity: number;
        productionCapacity: number;
        tags?: string[] | undefined;
        materials?: string[] | undefined;
        images?: string[] | undefined;
    };
}, {
    body: {
        name: string;
        category: string;
        description: string;
        dimensions: string;
        price: number;
        productionCapacity: number;
        tags?: string[] | undefined;
        materials?: string[] | undefined;
        minimumOrderQuantity?: number | undefined;
        images?: string[] | undefined;
    };
}>;
export declare const updateProductSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        category: z.ZodOptional<z.ZodString>;
        materials: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        dimensions: z.ZodOptional<z.ZodString>;
        price: z.ZodOptional<z.ZodNumber>;
        minimumOrderQuantity: z.ZodOptional<z.ZodNumber>;
        productionCapacity: z.ZodOptional<z.ZodNumber>;
        images: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        status: z.ZodOptional<z.ZodEnum<["draft", "active", "inactive"]>>;
    }, "strip", z.ZodTypeAny, {
        name?: string | undefined;
        category?: string | undefined;
        description?: string | undefined;
        tags?: string[] | undefined;
        status?: "draft" | "active" | "inactive" | undefined;
        materials?: string[] | undefined;
        dimensions?: string | undefined;
        price?: number | undefined;
        minimumOrderQuantity?: number | undefined;
        productionCapacity?: number | undefined;
        images?: string[] | undefined;
    }, {
        name?: string | undefined;
        category?: string | undefined;
        description?: string | undefined;
        tags?: string[] | undefined;
        status?: "draft" | "active" | "inactive" | undefined;
        materials?: string[] | undefined;
        dimensions?: string | undefined;
        price?: number | undefined;
        minimumOrderQuantity?: number | undefined;
        productionCapacity?: number | undefined;
        images?: string[] | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        name?: string | undefined;
        category?: string | undefined;
        description?: string | undefined;
        tags?: string[] | undefined;
        status?: "draft" | "active" | "inactive" | undefined;
        materials?: string[] | undefined;
        dimensions?: string | undefined;
        price?: number | undefined;
        minimumOrderQuantity?: number | undefined;
        productionCapacity?: number | undefined;
        images?: string[] | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        name?: string | undefined;
        category?: string | undefined;
        description?: string | undefined;
        tags?: string[] | undefined;
        status?: "draft" | "active" | "inactive" | undefined;
        materials?: string[] | undefined;
        dimensions?: string | undefined;
        price?: number | undefined;
        minimumOrderQuantity?: number | undefined;
        productionCapacity?: number | undefined;
        images?: string[] | undefined;
    };
}>;
export declare const createBusinessPlanSchema: z.ZodObject<{
    body: z.ZodObject<{
        idea: z.ZodString;
        requiredInvestment: z.ZodNumber;
        rawMaterials: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        equipment: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        operatingCost: z.ZodNumber;
        pricingStrategy: z.ZodObject<{
            costPrice: z.ZodNumber;
            sellingPrice: z.ZodNumber;
            margin: z.ZodNumber;
            wholesalePrice: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            costPrice: number;
            sellingPrice: number;
            margin: number;
            wholesalePrice?: number | undefined;
        }, {
            costPrice: number;
            sellingPrice: number;
            margin: number;
            wholesalePrice?: number | undefined;
        }>;
        customerSegments: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        marketingPlan: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        riskFactors: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        nextActions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        requiredInvestment: number;
        idea: string;
        operatingCost: number;
        pricingStrategy: {
            costPrice: number;
            sellingPrice: number;
            margin: number;
            wholesalePrice?: number | undefined;
        };
        customerSegments?: string[] | undefined;
        rawMaterials?: string[] | undefined;
        equipment?: string[] | undefined;
        marketingPlan?: string[] | undefined;
        riskFactors?: string[] | undefined;
        nextActions?: string[] | undefined;
    }, {
        requiredInvestment: number;
        idea: string;
        operatingCost: number;
        pricingStrategy: {
            costPrice: number;
            sellingPrice: number;
            margin: number;
            wholesalePrice?: number | undefined;
        };
        customerSegments?: string[] | undefined;
        rawMaterials?: string[] | undefined;
        equipment?: string[] | undefined;
        marketingPlan?: string[] | undefined;
        riskFactors?: string[] | undefined;
        nextActions?: string[] | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        requiredInvestment: number;
        idea: string;
        operatingCost: number;
        pricingStrategy: {
            costPrice: number;
            sellingPrice: number;
            margin: number;
            wholesalePrice?: number | undefined;
        };
        customerSegments?: string[] | undefined;
        rawMaterials?: string[] | undefined;
        equipment?: string[] | undefined;
        marketingPlan?: string[] | undefined;
        riskFactors?: string[] | undefined;
        nextActions?: string[] | undefined;
    };
}, {
    body: {
        requiredInvestment: number;
        idea: string;
        operatingCost: number;
        pricingStrategy: {
            costPrice: number;
            sellingPrice: number;
            margin: number;
            wholesalePrice?: number | undefined;
        };
        customerSegments?: string[] | undefined;
        rawMaterials?: string[] | undefined;
        equipment?: string[] | undefined;
        marketingPlan?: string[] | undefined;
        riskFactors?: string[] | undefined;
        nextActions?: string[] | undefined;
    };
}>;
export declare const createOrderSchema: z.ZodObject<{
    body: z.ZodObject<{
        buyerId: z.ZodOptional<z.ZodString>;
        items: z.ZodArray<z.ZodObject<{
            productId: z.ZodString;
            productName: z.ZodString;
            quantity: z.ZodNumber;
            unitPrice: z.ZodNumber;
            totalPrice: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            quantity: number;
            productId: string;
            productName: string;
            unitPrice: number;
            totalPrice: number;
        }, {
            quantity: number;
            productId: string;
            productName: string;
            unitPrice: number;
            totalPrice: number;
        }>, "many">;
        shippingAddress: z.ZodObject<{
            name: z.ZodString;
            phone: z.ZodString;
            address: z.ZodString;
            city: z.ZodString;
            state: z.ZodString;
            pincode: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            state: string;
            pincode: string;
            name: string;
            phone: string;
            address: string;
            city: string;
        }, {
            state: string;
            pincode: string;
            name: string;
            phone: string;
            address: string;
            city: string;
        }>;
        paymentMethod: z.ZodOptional<z.ZodString>;
        notes: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        items: {
            quantity: number;
            productId: string;
            productName: string;
            unitPrice: number;
            totalPrice: number;
        }[];
        shippingAddress: {
            state: string;
            pincode: string;
            name: string;
            phone: string;
            address: string;
            city: string;
        };
        notes?: string | undefined;
        buyerId?: string | undefined;
        paymentMethod?: string | undefined;
    }, {
        items: {
            quantity: number;
            productId: string;
            productName: string;
            unitPrice: number;
            totalPrice: number;
        }[];
        shippingAddress: {
            state: string;
            pincode: string;
            name: string;
            phone: string;
            address: string;
            city: string;
        };
        notes?: string | undefined;
        buyerId?: string | undefined;
        paymentMethod?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        items: {
            quantity: number;
            productId: string;
            productName: string;
            unitPrice: number;
            totalPrice: number;
        }[];
        shippingAddress: {
            state: string;
            pincode: string;
            name: string;
            phone: string;
            address: string;
            city: string;
        };
        notes?: string | undefined;
        buyerId?: string | undefined;
        paymentMethod?: string | undefined;
    };
}, {
    body: {
        items: {
            quantity: number;
            productId: string;
            productName: string;
            unitPrice: number;
            totalPrice: number;
        }[];
        shippingAddress: {
            state: string;
            pincode: string;
            name: string;
            phone: string;
            address: string;
            city: string;
        };
        notes?: string | undefined;
        buyerId?: string | undefined;
        paymentMethod?: string | undefined;
    };
}>;
export declare const createMarketRequestSchema: z.ZodObject<{
    body: z.ZodObject<{
        productId: z.ZodOptional<z.ZodString>;
        buyerId: z.ZodOptional<z.ZodString>;
        type: z.ZodEnum<["connect", "rfq", "order"]>;
        message: z.ZodString;
        quantity: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        type: "order" | "connect" | "rfq";
        message: string;
        quantity?: number | undefined;
        productId?: string | undefined;
        buyerId?: string | undefined;
    }, {
        type: "order" | "connect" | "rfq";
        message: string;
        quantity?: number | undefined;
        productId?: string | undefined;
        buyerId?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        type: "order" | "connect" | "rfq";
        message: string;
        quantity?: number | undefined;
        productId?: string | undefined;
        buyerId?: string | undefined;
    };
}, {
    body: {
        type: "order" | "connect" | "rfq";
        message: string;
        quantity?: number | undefined;
        productId?: string | undefined;
        buyerId?: string | undefined;
    };
}>;
export declare const aiChatSchema: z.ZodObject<{
    body: z.ZodObject<{
        message: z.ZodString;
        context: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        message: string;
        context?: Record<string, unknown> | undefined;
    }, {
        message: string;
        context?: Record<string, unknown> | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        message: string;
        context?: Record<string, unknown> | undefined;
    };
}, {
    body: {
        message: string;
        context?: Record<string, unknown> | undefined;
    };
}>;
export declare const aiExplainSchema: z.ZodObject<{
    body: z.ZodObject<{
        topic: z.ZodString;
        language: z.ZodEnum<["hi", "en"]>;
        style: z.ZodEnum<["simple", "example", "village"]>;
    }, "strip", z.ZodTypeAny, {
        language: "hi" | "en";
        topic: string;
        style: "village" | "simple" | "example";
    }, {
        language: "hi" | "en";
        topic: string;
        style: "village" | "simple" | "example";
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        language: "hi" | "en";
        topic: string;
        style: "village" | "simple" | "example";
    };
}, {
    body: {
        language: "hi" | "en";
        topic: string;
        style: "village" | "simple" | "example";
    };
}>;
export declare const aiRecommendSkillsSchema: z.ZodObject<{
    body: z.ZodObject<{
        skills: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            category: z.ZodString;
            proficiency: z.ZodEnum<["beginner", "intermediate", "advanced"]>;
            yearsExperience: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            name: string;
            category: string;
            proficiency: "beginner" | "intermediate" | "advanced";
            yearsExperience: number;
        }, {
            name: string;
            category: string;
            proficiency: "beginner" | "intermediate" | "advanced";
            yearsExperience: number;
        }>, "many">>;
        interests: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            category: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: string;
            category: string;
        }, {
            name: string;
            category: string;
        }>, "many">>;
        businessInterest: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            category: z.ZodString;
            description: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: string;
            category: string;
            description: string;
        }, {
            name: string;
            category: string;
            description: string;
        }>, "many">>;
        location: z.ZodOptional<z.ZodObject<{
            state: z.ZodOptional<z.ZodString>;
            district: z.ZodOptional<z.ZodString>;
            village: z.ZodOptional<z.ZodString>;
            pincode: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            state?: string | undefined;
            district?: string | undefined;
            village?: string | undefined;
            pincode?: string | undefined;
        }, {
            state?: string | undefined;
            district?: string | undefined;
            village?: string | undefined;
            pincode?: string | undefined;
        }>>;
        goals: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            description: z.ZodString;
            category: z.ZodEnum<["learn", "start", "grow", "customers", "funding"]>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            category: "learn" | "start" | "grow" | "customers" | "funding";
            description: string;
        }, {
            name: string;
            category: "learn" | "start" | "grow" | "customers" | "funding";
            description: string;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        skills?: {
            name: string;
            category: string;
            proficiency: "beginner" | "intermediate" | "advanced";
            yearsExperience: number;
        }[] | undefined;
        interests?: {
            name: string;
            category: string;
        }[] | undefined;
        businessInterest?: {
            name: string;
            category: string;
            description: string;
        }[] | undefined;
        goals?: {
            name: string;
            category: "learn" | "start" | "grow" | "customers" | "funding";
            description: string;
        }[] | undefined;
        location?: {
            state?: string | undefined;
            district?: string | undefined;
            village?: string | undefined;
            pincode?: string | undefined;
        } | undefined;
    }, {
        skills?: {
            name: string;
            category: string;
            proficiency: "beginner" | "intermediate" | "advanced";
            yearsExperience: number;
        }[] | undefined;
        interests?: {
            name: string;
            category: string;
        }[] | undefined;
        businessInterest?: {
            name: string;
            category: string;
            description: string;
        }[] | undefined;
        goals?: {
            name: string;
            category: "learn" | "start" | "grow" | "customers" | "funding";
            description: string;
        }[] | undefined;
        location?: {
            state?: string | undefined;
            district?: string | undefined;
            village?: string | undefined;
            pincode?: string | undefined;
        } | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        skills?: {
            name: string;
            category: string;
            proficiency: "beginner" | "intermediate" | "advanced";
            yearsExperience: number;
        }[] | undefined;
        interests?: {
            name: string;
            category: string;
        }[] | undefined;
        businessInterest?: {
            name: string;
            category: string;
            description: string;
        }[] | undefined;
        goals?: {
            name: string;
            category: "learn" | "start" | "grow" | "customers" | "funding";
            description: string;
        }[] | undefined;
        location?: {
            state?: string | undefined;
            district?: string | undefined;
            village?: string | undefined;
            pincode?: string | undefined;
        } | undefined;
    };
}, {
    body: {
        skills?: {
            name: string;
            category: string;
            proficiency: "beginner" | "intermediate" | "advanced";
            yearsExperience: number;
        }[] | undefined;
        interests?: {
            name: string;
            category: string;
        }[] | undefined;
        businessInterest?: {
            name: string;
            category: string;
            description: string;
        }[] | undefined;
        goals?: {
            name: string;
            category: "learn" | "start" | "grow" | "customers" | "funding";
            description: string;
        }[] | undefined;
        location?: {
            state?: string | undefined;
            district?: string | undefined;
            village?: string | undefined;
            pincode?: string | undefined;
        } | undefined;
    };
}>;
export declare const aiDiscoverSchema: z.ZodObject<{
    body: z.ZodObject<{
        query: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        query: string;
    }, {
        query: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        query: string;
    };
}, {
    body: {
        query: string;
    };
}>;
export declare const aiSimulateIncomeSchema: z.ZodObject<{
    body: z.ZodObject<{
        opportunity: z.ZodString;
        investment: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        opportunity: string;
        investment: number;
    }, {
        opportunity: string;
        investment: number;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        opportunity: string;
        investment: number;
    };
}, {
    body: {
        opportunity: string;
        investment: number;
    };
}>;
export declare const aiLearningPlanSchema: z.ZodObject<{
    body: z.ZodObject<{
        topic: z.ZodString;
        level: z.ZodDefault<z.ZodEnum<["beginner", "intermediate", "advanced"]>>;
    }, "strip", z.ZodTypeAny, {
        level: "beginner" | "intermediate" | "advanced";
        topic: string;
    }, {
        topic: string;
        level?: "beginner" | "intermediate" | "advanced" | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        level: "beginner" | "intermediate" | "advanced";
        topic: string;
    };
}, {
    body: {
        topic: string;
        level?: "beginner" | "intermediate" | "advanced" | undefined;
    };
}>;
export declare const aiQuizSchema: z.ZodObject<{
    body: z.ZodObject<{
        topic: z.ZodString;
        count: z.ZodDefault<z.ZodNumber>;
        level: z.ZodDefault<z.ZodEnum<["beginner", "intermediate", "advanced"]>>;
    }, "strip", z.ZodTypeAny, {
        level: "beginner" | "intermediate" | "advanced";
        count: number;
        topic: string;
    }, {
        topic: string;
        level?: "beginner" | "intermediate" | "advanced" | undefined;
        count?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        level: "beginner" | "intermediate" | "advanced";
        count: number;
        topic: string;
    };
}, {
    body: {
        topic: string;
        level?: "beginner" | "intermediate" | "advanced" | undefined;
        count?: number | undefined;
    };
}>;
export declare const aiAssessmentSchema: z.ZodObject<{
    body: z.ZodObject<{
        answers: z.ZodArray<z.ZodNumber, "many">;
        questions: z.ZodArray<z.ZodObject<{
            question: z.ZodString;
            options: z.ZodArray<z.ZodString, "many">;
            correctAnswer: z.ZodNumber;
            explanation: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            options: string[];
            question: string;
            correctAnswer: number;
            explanation?: string | undefined;
        }, {
            options: string[];
            question: string;
            correctAnswer: number;
            explanation?: string | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        questions: {
            options: string[];
            question: string;
            correctAnswer: number;
            explanation?: string | undefined;
        }[];
        answers: number[];
    }, {
        questions: {
            options: string[];
            question: string;
            correctAnswer: number;
            explanation?: string | undefined;
        }[];
        answers: number[];
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        questions: {
            options: string[];
            question: string;
            correctAnswer: number;
            explanation?: string | undefined;
        }[];
        answers: number[];
    };
}, {
    body: {
        questions: {
            options: string[];
            question: string;
            correctAnswer: number;
            explanation?: string | undefined;
        }[];
        answers: number[];
    };
}>;
export declare const aiBusinessPlanSchema: z.ZodObject<{
    body: z.ZodObject<{
        idea: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        idea: string;
    }, {
        idea: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        idea: string;
    };
}, {
    body: {
        idea: string;
    };
}>;
export declare const aiAnalyzeProductSchema: z.ZodObject<{
    body: z.ZodObject<{
        description: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        description: string;
    }, {
        description: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        description: string;
    };
}, {
    body: {
        description: string;
    };
}>;
export declare const aiProductCatalogSchema: z.ZodObject<{
    body: z.ZodObject<{
        ideas: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        ideas: string[];
    }, {
        ideas: string[];
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        ideas: string[];
    };
}, {
    body: {
        ideas: string[];
    };
}>;
export declare const aiProductPassportSchema: z.ZodObject<{
    body: z.ZodObject<{
        product: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    }, "strip", z.ZodTypeAny, {
        product: Record<string, unknown>;
    }, {
        product: Record<string, unknown>;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        product: Record<string, unknown>;
    };
}, {
    body: {
        product: Record<string, unknown>;
    };
}>;
export declare const aiMatchBuyersSchema: z.ZodObject<{
    body: z.ZodObject<{
        productInfo: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        productInfo?: string | undefined;
    }, {
        productInfo?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        productInfo?: string | undefined;
    };
}, {
    body: {
        productInfo?: string | undefined;
    };
}>;
export declare const aiVoiceToTextSchema: z.ZodObject<{
    body: z.ZodObject<{
        audio: z.ZodString;
        language: z.ZodOptional<z.ZodEnum<["hi", "en", "hindi", "english"]>>;
    }, "strip", z.ZodTypeAny, {
        audio: string;
        language?: "hi" | "en" | "hindi" | "english" | undefined;
    }, {
        audio: string;
        language?: "hi" | "en" | "hindi" | "english" | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        audio: string;
        language?: "hi" | "en" | "hindi" | "english" | undefined;
    };
}, {
    body: {
        audio: string;
        language?: "hi" | "en" | "hindi" | "english" | undefined;
    };
}>;
export declare const aiTextToVoiceSchema: z.ZodObject<{
    body: z.ZodObject<{
        text: z.ZodString;
        language: z.ZodOptional<z.ZodEnum<["hi", "en", "hindi", "english"]>>;
        voice: z.ZodOptional<z.ZodString>;
        speed: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        text: string;
        language?: "hi" | "en" | "hindi" | "english" | undefined;
        voice?: string | undefined;
        speed?: number | undefined;
    }, {
        text: string;
        language?: "hi" | "en" | "hindi" | "english" | undefined;
        voice?: string | undefined;
        speed?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        text: string;
        language?: "hi" | "en" | "hindi" | "english" | undefined;
        voice?: string | undefined;
        speed?: number | undefined;
    };
}, {
    body: {
        text: string;
        language?: "hi" | "en" | "hindi" | "english" | undefined;
        voice?: string | undefined;
        speed?: number | undefined;
    };
}>;
export declare const opportunityFiltersSchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodDefault<z.ZodNumber>;
        limit: z.ZodDefault<z.ZodNumber>;
        category: z.ZodOptional<z.ZodString>;
        difficulty: z.ZodOptional<z.ZodEnum<["easy", "medium", "hard"]>>;
        minInvestment: z.ZodOptional<z.ZodNumber>;
        maxInvestment: z.ZodOptional<z.ZodNumber>;
        skill: z.ZodOptional<z.ZodString>;
        location: z.ZodOptional<z.ZodString>;
        search: z.ZodOptional<z.ZodString>;
        sort: z.ZodDefault<z.ZodEnum<["matchPercentage", "requiredInvestment", "createdAt"]>>;
        order: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
    }, "strip", z.ZodTypeAny, {
        sort: "createdAt" | "requiredInvestment" | "matchPercentage";
        limit: number;
        order: "asc" | "desc";
        page: number;
        category?: string | undefined;
        search?: string | undefined;
        location?: string | undefined;
        difficulty?: "easy" | "medium" | "hard" | undefined;
        minInvestment?: number | undefined;
        maxInvestment?: number | undefined;
        skill?: string | undefined;
    }, {
        sort?: "createdAt" | "requiredInvestment" | "matchPercentage" | undefined;
        category?: string | undefined;
        search?: string | undefined;
        limit?: number | undefined;
        location?: string | undefined;
        difficulty?: "easy" | "medium" | "hard" | undefined;
        order?: "asc" | "desc" | undefined;
        page?: number | undefined;
        minInvestment?: number | undefined;
        maxInvestment?: number | undefined;
        skill?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        sort: "createdAt" | "requiredInvestment" | "matchPercentage";
        limit: number;
        order: "asc" | "desc";
        page: number;
        category?: string | undefined;
        search?: string | undefined;
        location?: string | undefined;
        difficulty?: "easy" | "medium" | "hard" | undefined;
        minInvestment?: number | undefined;
        maxInvestment?: number | undefined;
        skill?: string | undefined;
    };
}, {
    query: {
        sort?: "createdAt" | "requiredInvestment" | "matchPercentage" | undefined;
        category?: string | undefined;
        search?: string | undefined;
        limit?: number | undefined;
        location?: string | undefined;
        difficulty?: "easy" | "medium" | "hard" | undefined;
        order?: "asc" | "desc" | undefined;
        page?: number | undefined;
        minInvestment?: number | undefined;
        maxInvestment?: number | undefined;
        skill?: string | undefined;
    };
}>;
export declare const schemeFiltersSchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodDefault<z.ZodNumber>;
        limit: z.ZodDefault<z.ZodNumber>;
        category: z.ZodOptional<z.ZodString>;
        search: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        limit: number;
        page: number;
        category?: string | undefined;
        search?: string | undefined;
    }, {
        category?: string | undefined;
        search?: string | undefined;
        limit?: number | undefined;
        page?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        limit: number;
        page: number;
        category?: string | undefined;
        search?: string | undefined;
    };
}, {
    query: {
        category?: string | undefined;
        search?: string | undefined;
        limit?: number | undefined;
        page?: number | undefined;
    };
}>;
export declare const productFiltersSchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodDefault<z.ZodNumber>;
        limit: z.ZodDefault<z.ZodNumber>;
        category: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodEnum<["draft", "active", "inactive"]>>;
        search: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        limit: number;
        page: number;
        category?: string | undefined;
        search?: string | undefined;
        status?: "draft" | "active" | "inactive" | undefined;
    }, {
        category?: string | undefined;
        search?: string | undefined;
        limit?: number | undefined;
        status?: "draft" | "active" | "inactive" | undefined;
        page?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        limit: number;
        page: number;
        category?: string | undefined;
        search?: string | undefined;
        status?: "draft" | "active" | "inactive" | undefined;
    };
}, {
    query: {
        category?: string | undefined;
        search?: string | undefined;
        limit?: number | undefined;
        status?: "draft" | "active" | "inactive" | undefined;
        page?: number | undefined;
    };
}>;
export declare const buyerFiltersSchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodDefault<z.ZodNumber>;
        limit: z.ZodDefault<z.ZodNumber>;
        type: z.ZodOptional<z.ZodEnum<["individual", "business", "wholesaler", "retailer", "exporter"]>>;
        product: z.ZodOptional<z.ZodString>;
        location: z.ZodOptional<z.ZodString>;
        verified: z.ZodOptional<z.ZodBoolean>;
        search: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        limit: number;
        page: number;
        type?: "individual" | "business" | "wholesaler" | "retailer" | "exporter" | undefined;
        search?: string | undefined;
        location?: string | undefined;
        verified?: boolean | undefined;
        product?: string | undefined;
    }, {
        type?: "individual" | "business" | "wholesaler" | "retailer" | "exporter" | undefined;
        search?: string | undefined;
        limit?: number | undefined;
        location?: string | undefined;
        verified?: boolean | undefined;
        page?: number | undefined;
        product?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        limit: number;
        page: number;
        type?: "individual" | "business" | "wholesaler" | "retailer" | "exporter" | undefined;
        search?: string | undefined;
        location?: string | undefined;
        verified?: boolean | undefined;
        product?: string | undefined;
    };
}, {
    query: {
        type?: "individual" | "business" | "wholesaler" | "retailer" | "exporter" | undefined;
        search?: string | undefined;
        limit?: number | undefined;
        location?: string | undefined;
        verified?: boolean | undefined;
        page?: number | undefined;
        product?: string | undefined;
    };
}>;
export declare const learningPathFiltersSchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodDefault<z.ZodNumber>;
        limit: z.ZodDefault<z.ZodNumber>;
        category: z.ZodOptional<z.ZodString>;
        difficulty: z.ZodOptional<z.ZodEnum<["beginner", "intermediate", "advanced"]>>;
        search: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        limit: number;
        page: number;
        category?: string | undefined;
        search?: string | undefined;
        difficulty?: "beginner" | "intermediate" | "advanced" | undefined;
    }, {
        category?: string | undefined;
        search?: string | undefined;
        limit?: number | undefined;
        difficulty?: "beginner" | "intermediate" | "advanced" | undefined;
        page?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        limit: number;
        page: number;
        category?: string | undefined;
        search?: string | undefined;
        difficulty?: "beginner" | "intermediate" | "advanced" | undefined;
    };
}, {
    query: {
        category?: string | undefined;
        search?: string | undefined;
        limit?: number | undefined;
        difficulty?: "beginner" | "intermediate" | "advanced" | undefined;
        page?: number | undefined;
    };
}>;
export declare const notificationFiltersSchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodDefault<z.ZodNumber>;
        limit: z.ZodDefault<z.ZodNumber>;
        type: z.ZodOptional<z.ZodString>;
        isRead: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        limit: number;
        page: number;
        type?: string | undefined;
        isRead?: boolean | undefined;
    }, {
        type?: string | undefined;
        limit?: number | undefined;
        isRead?: boolean | undefined;
        page?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        limit: number;
        page: number;
        type?: string | undefined;
        isRead?: boolean | undefined;
    };
}, {
    query: {
        type?: string | undefined;
        limit?: number | undefined;
        isRead?: boolean | undefined;
        page?: number | undefined;
    };
}>;
export declare const paginationSchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodDefault<z.ZodNumber>;
        limit: z.ZodDefault<z.ZodNumber>;
        sort: z.ZodOptional<z.ZodString>;
        order: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
    }, "strip", z.ZodTypeAny, {
        limit: number;
        order: "asc" | "desc";
        page: number;
        sort?: string | undefined;
    }, {
        sort?: string | undefined;
        limit?: number | undefined;
        order?: "asc" | "desc" | undefined;
        page?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        limit: number;
        order: "asc" | "desc";
        page: number;
        sort?: string | undefined;
    };
}, {
    query: {
        sort?: string | undefined;
        limit?: number | undefined;
        order?: "asc" | "desc" | undefined;
        page?: number | undefined;
    };
}>;
export declare const mongoIdSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
}, {
    params: {
        id: string;
    };
}>;
export declare const mongoIdParamSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
}, {
    params: {
        id: string;
    };
}>;
export declare const lessonRouteSchema: z.ZodObject<{
    params: z.ZodObject<{
        pathId: z.ZodString;
        lessonId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        lessonId: string;
        pathId: string;
    }, {
        lessonId: string;
        pathId: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        lessonId: string;
        pathId: string;
    };
}, {
    params: {
        lessonId: string;
        pathId: string;
    };
}>;
export declare const notificationIdSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
}, {
    params: {
        id: string;
    };
}>;
export declare const idParamSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
}, {
    params: {
        id: string;
    };
}>;
export * from './admin';
//# sourceMappingURL=index.d.ts.map