import { z } from 'zod';
export declare const adminPaginationSchema: z.ZodObject<{
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
export declare const userFiltersSchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodDefault<z.ZodNumber>;
        limit: z.ZodDefault<z.ZodNumber>;
        role: z.ZodOptional<z.ZodEnum<["USER", "ADMIN", "SUPER_ADMIN"]>>;
        isActive: z.ZodOptional<z.ZodEnum<["true", "false"]>>;
        onboardingCompleted: z.ZodOptional<z.ZodEnum<["true", "false"]>>;
        state: z.ZodOptional<z.ZodString>;
        district: z.ZodOptional<z.ZodString>;
        search: z.ZodOptional<z.ZodString>;
        sort: z.ZodDefault<z.ZodEnum<["createdAt", "name", "lastLoginAt"]>>;
        order: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
    }, "strip", z.ZodTypeAny, {
        sort: "name" | "lastLoginAt" | "createdAt";
        limit: number;
        order: "asc" | "desc";
        page: number;
        state?: string | undefined;
        district?: string | undefined;
        search?: string | undefined;
        onboardingCompleted?: "true" | "false" | undefined;
        role?: "USER" | "ADMIN" | "SUPER_ADMIN" | undefined;
        isActive?: "true" | "false" | undefined;
    }, {
        state?: string | undefined;
        district?: string | undefined;
        sort?: "name" | "lastLoginAt" | "createdAt" | undefined;
        search?: string | undefined;
        limit?: number | undefined;
        onboardingCompleted?: "true" | "false" | undefined;
        role?: "USER" | "ADMIN" | "SUPER_ADMIN" | undefined;
        isActive?: "true" | "false" | undefined;
        order?: "asc" | "desc" | undefined;
        page?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        sort: "name" | "lastLoginAt" | "createdAt";
        limit: number;
        order: "asc" | "desc";
        page: number;
        state?: string | undefined;
        district?: string | undefined;
        search?: string | undefined;
        onboardingCompleted?: "true" | "false" | undefined;
        role?: "USER" | "ADMIN" | "SUPER_ADMIN" | undefined;
        isActive?: "true" | "false" | undefined;
    };
}, {
    query: {
        state?: string | undefined;
        district?: string | undefined;
        sort?: "name" | "lastLoginAt" | "createdAt" | undefined;
        search?: string | undefined;
        limit?: number | undefined;
        onboardingCompleted?: "true" | "false" | undefined;
        role?: "USER" | "ADMIN" | "SUPER_ADMIN" | undefined;
        isActive?: "true" | "false" | undefined;
        order?: "asc" | "desc" | undefined;
        page?: number | undefined;
    };
}>;
export declare const updateUserSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
        role: z.ZodOptional<z.ZodEnum<["USER", "ADMIN", "SUPER_ADMIN"]>>;
        isActive: z.ZodOptional<z.ZodBoolean>;
        onboardingCompleted: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        name?: string | undefined;
        phone?: string | undefined;
        email?: string | undefined;
        onboardingCompleted?: boolean | undefined;
        role?: "USER" | "ADMIN" | "SUPER_ADMIN" | undefined;
        isActive?: boolean | undefined;
    }, {
        name?: string | undefined;
        phone?: string | undefined;
        email?: string | undefined;
        onboardingCompleted?: boolean | undefined;
        role?: "USER" | "ADMIN" | "SUPER_ADMIN" | undefined;
        isActive?: boolean | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        name?: string | undefined;
        phone?: string | undefined;
        email?: string | undefined;
        onboardingCompleted?: boolean | undefined;
        role?: "USER" | "ADMIN" | "SUPER_ADMIN" | undefined;
        isActive?: boolean | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        name?: string | undefined;
        phone?: string | undefined;
        email?: string | undefined;
        onboardingCompleted?: boolean | undefined;
        role?: "USER" | "ADMIN" | "SUPER_ADMIN" | undefined;
        isActive?: boolean | undefined;
    };
}>;
export declare const skillFiltersSchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodDefault<z.ZodNumber>;
        limit: z.ZodDefault<z.ZodNumber>;
        category: z.ZodOptional<z.ZodString>;
        proficiency: z.ZodOptional<z.ZodEnum<["beginner", "intermediate", "advanced"]>>;
        isActive: z.ZodOptional<z.ZodEnum<["true", "false"]>>;
        search: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        limit: number;
        page: number;
        category?: string | undefined;
        proficiency?: "beginner" | "intermediate" | "advanced" | undefined;
        search?: string | undefined;
        isActive?: "true" | "false" | undefined;
    }, {
        category?: string | undefined;
        proficiency?: "beginner" | "intermediate" | "advanced" | undefined;
        search?: string | undefined;
        limit?: number | undefined;
        isActive?: "true" | "false" | undefined;
        page?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        limit: number;
        page: number;
        category?: string | undefined;
        proficiency?: "beginner" | "intermediate" | "advanced" | undefined;
        search?: string | undefined;
        isActive?: "true" | "false" | undefined;
    };
}, {
    query: {
        category?: string | undefined;
        proficiency?: "beginner" | "intermediate" | "advanced" | undefined;
        search?: string | undefined;
        limit?: number | undefined;
        isActive?: "true" | "false" | undefined;
        page?: number | undefined;
    };
}>;
export declare const createSkillSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        category: z.ZodString;
        proficiency: z.ZodEnum<["beginner", "intermediate", "advanced"]>;
        yearsExperience: z.ZodNumber;
        description: z.ZodOptional<z.ZodString>;
        learningResourceUrl: z.ZodOptional<z.ZodString>;
        isActive: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        category: string;
        proficiency: "beginner" | "intermediate" | "advanced";
        yearsExperience: number;
        isActive: boolean;
        description?: string | undefined;
        learningResourceUrl?: string | undefined;
    }, {
        name: string;
        category: string;
        proficiency: "beginner" | "intermediate" | "advanced";
        yearsExperience: number;
        description?: string | undefined;
        isActive?: boolean | undefined;
        learningResourceUrl?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        name: string;
        category: string;
        proficiency: "beginner" | "intermediate" | "advanced";
        yearsExperience: number;
        isActive: boolean;
        description?: string | undefined;
        learningResourceUrl?: string | undefined;
    };
}, {
    body: {
        name: string;
        category: string;
        proficiency: "beginner" | "intermediate" | "advanced";
        yearsExperience: number;
        description?: string | undefined;
        isActive?: boolean | undefined;
        learningResourceUrl?: string | undefined;
    };
}>;
export declare const updateSkillSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        category: z.ZodOptional<z.ZodString>;
        proficiency: z.ZodOptional<z.ZodEnum<["beginner", "intermediate", "advanced"]>>;
        yearsExperience: z.ZodOptional<z.ZodNumber>;
        description: z.ZodOptional<z.ZodString>;
        learningResourceUrl: z.ZodOptional<z.ZodString>;
        isActive: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        name?: string | undefined;
        category?: string | undefined;
        proficiency?: "beginner" | "intermediate" | "advanced" | undefined;
        yearsExperience?: number | undefined;
        description?: string | undefined;
        isActive?: boolean | undefined;
        learningResourceUrl?: string | undefined;
    }, {
        name?: string | undefined;
        category?: string | undefined;
        proficiency?: "beginner" | "intermediate" | "advanced" | undefined;
        yearsExperience?: number | undefined;
        description?: string | undefined;
        isActive?: boolean | undefined;
        learningResourceUrl?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        name?: string | undefined;
        category?: string | undefined;
        proficiency?: "beginner" | "intermediate" | "advanced" | undefined;
        yearsExperience?: number | undefined;
        description?: string | undefined;
        isActive?: boolean | undefined;
        learningResourceUrl?: string | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        name?: string | undefined;
        category?: string | undefined;
        proficiency?: "beginner" | "intermediate" | "advanced" | undefined;
        yearsExperience?: number | undefined;
        description?: string | undefined;
        isActive?: boolean | undefined;
        learningResourceUrl?: string | undefined;
    };
}>;
export declare const opportunityFiltersSchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodDefault<z.ZodNumber>;
        limit: z.ZodDefault<z.ZodNumber>;
        category: z.ZodOptional<z.ZodString>;
        difficulty: z.ZodOptional<z.ZodEnum<["easy", "medium", "hard"]>>;
        isActive: z.ZodOptional<z.ZodEnum<["true", "false"]>>;
        search: z.ZodOptional<z.ZodString>;
        sort: z.ZodDefault<z.ZodEnum<["createdAt", "matchPercentage", "title"]>>;
        order: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
    }, "strip", z.ZodTypeAny, {
        sort: "createdAt" | "title" | "matchPercentage";
        limit: number;
        order: "asc" | "desc";
        page: number;
        category?: string | undefined;
        search?: string | undefined;
        isActive?: "true" | "false" | undefined;
        difficulty?: "easy" | "medium" | "hard" | undefined;
    }, {
        sort?: "createdAt" | "title" | "matchPercentage" | undefined;
        category?: string | undefined;
        search?: string | undefined;
        limit?: number | undefined;
        isActive?: "true" | "false" | undefined;
        difficulty?: "easy" | "medium" | "hard" | undefined;
        order?: "asc" | "desc" | undefined;
        page?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        sort: "createdAt" | "title" | "matchPercentage";
        limit: number;
        order: "asc" | "desc";
        page: number;
        category?: string | undefined;
        search?: string | undefined;
        isActive?: "true" | "false" | undefined;
        difficulty?: "easy" | "medium" | "hard" | undefined;
    };
}, {
    query: {
        sort?: "createdAt" | "title" | "matchPercentage" | undefined;
        category?: string | undefined;
        search?: string | undefined;
        limit?: number | undefined;
        isActive?: "true" | "false" | undefined;
        difficulty?: "easy" | "medium" | "hard" | undefined;
        order?: "asc" | "desc" | undefined;
        page?: number | undefined;
    };
}>;
export declare const createOpportunitySchema: z.ZodObject<{
    body: z.ZodObject<{
        title: z.ZodString;
        description: z.ZodString;
        category: z.ZodString;
        requiredInvestment: z.ZodObject<{
            min: z.ZodNumber;
            max: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            min: number;
            max: number;
        }, {
            min: number;
            max: number;
        }>;
        requiredSkills: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        learningDuration: z.ZodString;
        difficulty: z.ZodEnum<["easy", "medium", "hard"]>;
        incomeScenarios: z.ZodObject<{
            conservative: z.ZodNumber;
            expected: z.ZodNumber;
            optimistic: z.ZodNumber;
            currency: z.ZodEnum<["INR"]>;
            period: z.ZodEnum<["monthly", "yearly"]>;
        }, "strip", z.ZodTypeAny, {
            conservative: number;
            expected: number;
            optimistic: number;
            currency: "INR";
            period: "monthly" | "yearly";
        }, {
            conservative: number;
            expected: number;
            optimistic: number;
            currency: "INR";
            period: "monthly" | "yearly";
        }>;
        customerSegments: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        location: z.ZodOptional<z.ZodString>;
        tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        isActive: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        category: string;
        description: string;
        isActive: boolean;
        title: string;
        requiredInvestment: {
            min: number;
            max: number;
        };
        learningDuration: string;
        difficulty: "easy" | "medium" | "hard";
        incomeScenarios: {
            conservative: number;
            expected: number;
            optimistic: number;
            currency: "INR";
            period: "monthly" | "yearly";
        };
        location?: string | undefined;
        requiredSkills?: string[] | undefined;
        customerSegments?: string[] | undefined;
        tags?: string[] | undefined;
    }, {
        category: string;
        description: string;
        title: string;
        requiredInvestment: {
            min: number;
            max: number;
        };
        learningDuration: string;
        difficulty: "easy" | "medium" | "hard";
        incomeScenarios: {
            conservative: number;
            expected: number;
            optimistic: number;
            currency: "INR";
            period: "monthly" | "yearly";
        };
        location?: string | undefined;
        isActive?: boolean | undefined;
        requiredSkills?: string[] | undefined;
        customerSegments?: string[] | undefined;
        tags?: string[] | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        category: string;
        description: string;
        isActive: boolean;
        title: string;
        requiredInvestment: {
            min: number;
            max: number;
        };
        learningDuration: string;
        difficulty: "easy" | "medium" | "hard";
        incomeScenarios: {
            conservative: number;
            expected: number;
            optimistic: number;
            currency: "INR";
            period: "monthly" | "yearly";
        };
        location?: string | undefined;
        requiredSkills?: string[] | undefined;
        customerSegments?: string[] | undefined;
        tags?: string[] | undefined;
    };
}, {
    body: {
        category: string;
        description: string;
        title: string;
        requiredInvestment: {
            min: number;
            max: number;
        };
        learningDuration: string;
        difficulty: "easy" | "medium" | "hard";
        incomeScenarios: {
            conservative: number;
            expected: number;
            optimistic: number;
            currency: "INR";
            period: "monthly" | "yearly";
        };
        location?: string | undefined;
        isActive?: boolean | undefined;
        requiredSkills?: string[] | undefined;
        customerSegments?: string[] | undefined;
        tags?: string[] | undefined;
    };
}>;
export declare const updateOpportunitySchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        category: z.ZodOptional<z.ZodString>;
        requiredInvestment: z.ZodOptional<z.ZodObject<{
            min: z.ZodNumber;
            max: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            min: number;
            max: number;
        }, {
            min: number;
            max: number;
        }>>;
        requiredSkills: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        learningDuration: z.ZodOptional<z.ZodString>;
        difficulty: z.ZodOptional<z.ZodEnum<["easy", "medium", "hard"]>>;
        incomeScenarios: z.ZodOptional<z.ZodObject<{
            conservative: z.ZodNumber;
            expected: z.ZodNumber;
            optimistic: z.ZodNumber;
            currency: z.ZodEnum<["INR"]>;
            period: z.ZodEnum<["monthly", "yearly"]>;
        }, "strip", z.ZodTypeAny, {
            conservative: number;
            expected: number;
            optimistic: number;
            currency: "INR";
            period: "monthly" | "yearly";
        }, {
            conservative: number;
            expected: number;
            optimistic: number;
            currency: "INR";
            period: "monthly" | "yearly";
        }>>;
        customerSegments: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        location: z.ZodOptional<z.ZodString>;
        matchPercentage: z.ZodOptional<z.ZodNumber>;
        tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        isActive: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        category?: string | undefined;
        description?: string | undefined;
        location?: string | undefined;
        isActive?: boolean | undefined;
        title?: string | undefined;
        requiredInvestment?: {
            min: number;
            max: number;
        } | undefined;
        requiredSkills?: string[] | undefined;
        learningDuration?: string | undefined;
        difficulty?: "easy" | "medium" | "hard" | undefined;
        incomeScenarios?: {
            conservative: number;
            expected: number;
            optimistic: number;
            currency: "INR";
            period: "monthly" | "yearly";
        } | undefined;
        customerSegments?: string[] | undefined;
        matchPercentage?: number | undefined;
        tags?: string[] | undefined;
    }, {
        category?: string | undefined;
        description?: string | undefined;
        location?: string | undefined;
        isActive?: boolean | undefined;
        title?: string | undefined;
        requiredInvestment?: {
            min: number;
            max: number;
        } | undefined;
        requiredSkills?: string[] | undefined;
        learningDuration?: string | undefined;
        difficulty?: "easy" | "medium" | "hard" | undefined;
        incomeScenarios?: {
            conservative: number;
            expected: number;
            optimistic: number;
            currency: "INR";
            period: "monthly" | "yearly";
        } | undefined;
        customerSegments?: string[] | undefined;
        matchPercentage?: number | undefined;
        tags?: string[] | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        category?: string | undefined;
        description?: string | undefined;
        location?: string | undefined;
        isActive?: boolean | undefined;
        title?: string | undefined;
        requiredInvestment?: {
            min: number;
            max: number;
        } | undefined;
        requiredSkills?: string[] | undefined;
        learningDuration?: string | undefined;
        difficulty?: "easy" | "medium" | "hard" | undefined;
        incomeScenarios?: {
            conservative: number;
            expected: number;
            optimistic: number;
            currency: "INR";
            period: "monthly" | "yearly";
        } | undefined;
        customerSegments?: string[] | undefined;
        matchPercentage?: number | undefined;
        tags?: string[] | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        category?: string | undefined;
        description?: string | undefined;
        location?: string | undefined;
        isActive?: boolean | undefined;
        title?: string | undefined;
        requiredInvestment?: {
            min: number;
            max: number;
        } | undefined;
        requiredSkills?: string[] | undefined;
        learningDuration?: string | undefined;
        difficulty?: "easy" | "medium" | "hard" | undefined;
        incomeScenarios?: {
            conservative: number;
            expected: number;
            optimistic: number;
            currency: "INR";
            period: "monthly" | "yearly";
        } | undefined;
        customerSegments?: string[] | undefined;
        matchPercentage?: number | undefined;
        tags?: string[] | undefined;
    };
}>;
export declare const learningPathFiltersSchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodDefault<z.ZodNumber>;
        limit: z.ZodDefault<z.ZodNumber>;
        category: z.ZodOptional<z.ZodString>;
        difficulty: z.ZodOptional<z.ZodEnum<["beginner", "intermediate", "advanced"]>>;
        isActive: z.ZodOptional<z.ZodEnum<["true", "false"]>>;
        search: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        limit: number;
        page: number;
        category?: string | undefined;
        search?: string | undefined;
        isActive?: "true" | "false" | undefined;
        difficulty?: "beginner" | "intermediate" | "advanced" | undefined;
    }, {
        category?: string | undefined;
        search?: string | undefined;
        limit?: number | undefined;
        isActive?: "true" | "false" | undefined;
        difficulty?: "beginner" | "intermediate" | "advanced" | undefined;
        page?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        limit: number;
        page: number;
        category?: string | undefined;
        search?: string | undefined;
        isActive?: "true" | "false" | undefined;
        difficulty?: "beginner" | "intermediate" | "advanced" | undefined;
    };
}, {
    query: {
        category?: string | undefined;
        search?: string | undefined;
        limit?: number | undefined;
        isActive?: "true" | "false" | undefined;
        difficulty?: "beginner" | "intermediate" | "advanced" | undefined;
        page?: number | undefined;
    };
}>;
export declare const createLearningPathSchema: z.ZodObject<{
    body: z.ZodObject<{
        title: z.ZodString;
        description: z.ZodString;
        category: z.ZodString;
        difficulty: z.ZodEnum<["beginner", "intermediate", "advanced"]>;
        estimatedDuration: z.ZodString;
        lessons: z.ZodArray<z.ZodObject<{
            title: z.ZodString;
            description: z.ZodString;
            videoUrl: z.ZodOptional<z.ZodString>;
            thumbnail: z.ZodOptional<z.ZodString>;
            duration: z.ZodString;
            difficulty: z.ZodEnum<["easy", "medium", "hard"]>;
            order: z.ZodNumber;
            keyPoints: z.ZodArray<z.ZodString, "many">;
            quiz: z.ZodOptional<z.ZodObject<{
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
                passingScore: z.ZodDefault<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                questions: {
                    options: string[];
                    question: string;
                    correctAnswer: number;
                    explanation?: string | undefined;
                }[];
                passingScore: number;
            }, {
                questions: {
                    options: string[];
                    question: string;
                    correctAnswer: number;
                    explanation?: string | undefined;
                }[];
                passingScore?: number | undefined;
            }>>;
            isActive: z.ZodDefault<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            description: string;
            isActive: boolean;
            title: string;
            difficulty: "easy" | "medium" | "hard";
            duration: string;
            order: number;
            keyPoints: string[];
            videoUrl?: string | undefined;
            thumbnail?: string | undefined;
            quiz?: {
                questions: {
                    options: string[];
                    question: string;
                    correctAnswer: number;
                    explanation?: string | undefined;
                }[];
                passingScore: number;
            } | undefined;
        }, {
            description: string;
            title: string;
            difficulty: "easy" | "medium" | "hard";
            duration: string;
            order: number;
            keyPoints: string[];
            isActive?: boolean | undefined;
            videoUrl?: string | undefined;
            thumbnail?: string | undefined;
            quiz?: {
                questions: {
                    options: string[];
                    question: string;
                    correctAnswer: number;
                    explanation?: string | undefined;
                }[];
                passingScore?: number | undefined;
            } | undefined;
        }>, "many">;
        tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        isActive: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        category: string;
        description: string;
        isActive: boolean;
        title: string;
        difficulty: "beginner" | "intermediate" | "advanced";
        estimatedDuration: string;
        lessons: {
            description: string;
            isActive: boolean;
            title: string;
            difficulty: "easy" | "medium" | "hard";
            duration: string;
            order: number;
            keyPoints: string[];
            videoUrl?: string | undefined;
            thumbnail?: string | undefined;
            quiz?: {
                questions: {
                    options: string[];
                    question: string;
                    correctAnswer: number;
                    explanation?: string | undefined;
                }[];
                passingScore: number;
            } | undefined;
        }[];
        tags?: string[] | undefined;
    }, {
        category: string;
        description: string;
        title: string;
        difficulty: "beginner" | "intermediate" | "advanced";
        estimatedDuration: string;
        lessons: {
            description: string;
            title: string;
            difficulty: "easy" | "medium" | "hard";
            duration: string;
            order: number;
            keyPoints: string[];
            isActive?: boolean | undefined;
            videoUrl?: string | undefined;
            thumbnail?: string | undefined;
            quiz?: {
                questions: {
                    options: string[];
                    question: string;
                    correctAnswer: number;
                    explanation?: string | undefined;
                }[];
                passingScore?: number | undefined;
            } | undefined;
        }[];
        isActive?: boolean | undefined;
        tags?: string[] | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        category: string;
        description: string;
        isActive: boolean;
        title: string;
        difficulty: "beginner" | "intermediate" | "advanced";
        estimatedDuration: string;
        lessons: {
            description: string;
            isActive: boolean;
            title: string;
            difficulty: "easy" | "medium" | "hard";
            duration: string;
            order: number;
            keyPoints: string[];
            videoUrl?: string | undefined;
            thumbnail?: string | undefined;
            quiz?: {
                questions: {
                    options: string[];
                    question: string;
                    correctAnswer: number;
                    explanation?: string | undefined;
                }[];
                passingScore: number;
            } | undefined;
        }[];
        tags?: string[] | undefined;
    };
}, {
    body: {
        category: string;
        description: string;
        title: string;
        difficulty: "beginner" | "intermediate" | "advanced";
        estimatedDuration: string;
        lessons: {
            description: string;
            title: string;
            difficulty: "easy" | "medium" | "hard";
            duration: string;
            order: number;
            keyPoints: string[];
            isActive?: boolean | undefined;
            videoUrl?: string | undefined;
            thumbnail?: string | undefined;
            quiz?: {
                questions: {
                    options: string[];
                    question: string;
                    correctAnswer: number;
                    explanation?: string | undefined;
                }[];
                passingScore?: number | undefined;
            } | undefined;
        }[];
        isActive?: boolean | undefined;
        tags?: string[] | undefined;
    };
}>;
export declare const updateLearningPathSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        category: z.ZodOptional<z.ZodString>;
        difficulty: z.ZodOptional<z.ZodEnum<["beginner", "intermediate", "advanced"]>>;
        estimatedDuration: z.ZodOptional<z.ZodString>;
        lessons: z.ZodOptional<z.ZodArray<z.ZodObject<{
            title: z.ZodOptional<z.ZodString>;
            description: z.ZodOptional<z.ZodString>;
            videoUrl: z.ZodOptional<z.ZodString>;
            thumbnail: z.ZodOptional<z.ZodString>;
            duration: z.ZodOptional<z.ZodString>;
            difficulty: z.ZodOptional<z.ZodEnum<["easy", "medium", "hard"]>>;
            order: z.ZodOptional<z.ZodNumber>;
            keyPoints: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            isActive: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            description?: string | undefined;
            isActive?: boolean | undefined;
            title?: string | undefined;
            difficulty?: "easy" | "medium" | "hard" | undefined;
            videoUrl?: string | undefined;
            thumbnail?: string | undefined;
            duration?: string | undefined;
            order?: number | undefined;
            keyPoints?: string[] | undefined;
        }, {
            description?: string | undefined;
            isActive?: boolean | undefined;
            title?: string | undefined;
            difficulty?: "easy" | "medium" | "hard" | undefined;
            videoUrl?: string | undefined;
            thumbnail?: string | undefined;
            duration?: string | undefined;
            order?: number | undefined;
            keyPoints?: string[] | undefined;
        }>, "many">>;
        tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        isActive: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        category?: string | undefined;
        description?: string | undefined;
        isActive?: boolean | undefined;
        title?: string | undefined;
        difficulty?: "beginner" | "intermediate" | "advanced" | undefined;
        tags?: string[] | undefined;
        estimatedDuration?: string | undefined;
        lessons?: {
            description?: string | undefined;
            isActive?: boolean | undefined;
            title?: string | undefined;
            difficulty?: "easy" | "medium" | "hard" | undefined;
            videoUrl?: string | undefined;
            thumbnail?: string | undefined;
            duration?: string | undefined;
            order?: number | undefined;
            keyPoints?: string[] | undefined;
        }[] | undefined;
    }, {
        category?: string | undefined;
        description?: string | undefined;
        isActive?: boolean | undefined;
        title?: string | undefined;
        difficulty?: "beginner" | "intermediate" | "advanced" | undefined;
        tags?: string[] | undefined;
        estimatedDuration?: string | undefined;
        lessons?: {
            description?: string | undefined;
            isActive?: boolean | undefined;
            title?: string | undefined;
            difficulty?: "easy" | "medium" | "hard" | undefined;
            videoUrl?: string | undefined;
            thumbnail?: string | undefined;
            duration?: string | undefined;
            order?: number | undefined;
            keyPoints?: string[] | undefined;
        }[] | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        category?: string | undefined;
        description?: string | undefined;
        isActive?: boolean | undefined;
        title?: string | undefined;
        difficulty?: "beginner" | "intermediate" | "advanced" | undefined;
        tags?: string[] | undefined;
        estimatedDuration?: string | undefined;
        lessons?: {
            description?: string | undefined;
            isActive?: boolean | undefined;
            title?: string | undefined;
            difficulty?: "easy" | "medium" | "hard" | undefined;
            videoUrl?: string | undefined;
            thumbnail?: string | undefined;
            duration?: string | undefined;
            order?: number | undefined;
            keyPoints?: string[] | undefined;
        }[] | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        category?: string | undefined;
        description?: string | undefined;
        isActive?: boolean | undefined;
        title?: string | undefined;
        difficulty?: "beginner" | "intermediate" | "advanced" | undefined;
        tags?: string[] | undefined;
        estimatedDuration?: string | undefined;
        lessons?: {
            description?: string | undefined;
            isActive?: boolean | undefined;
            title?: string | undefined;
            difficulty?: "easy" | "medium" | "hard" | undefined;
            videoUrl?: string | undefined;
            thumbnail?: string | undefined;
            duration?: string | undefined;
            order?: number | undefined;
            keyPoints?: string[] | undefined;
        }[] | undefined;
    };
}>;
export declare const lessonUpdateSchema: z.ZodObject<{
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
    body: z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        videoUrl: z.ZodOptional<z.ZodString>;
        thumbnail: z.ZodOptional<z.ZodString>;
        duration: z.ZodOptional<z.ZodString>;
        difficulty: z.ZodOptional<z.ZodEnum<["easy", "medium", "hard"]>>;
        order: z.ZodOptional<z.ZodNumber>;
        keyPoints: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        isActive: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        description?: string | undefined;
        isActive?: boolean | undefined;
        title?: string | undefined;
        difficulty?: "easy" | "medium" | "hard" | undefined;
        videoUrl?: string | undefined;
        thumbnail?: string | undefined;
        duration?: string | undefined;
        order?: number | undefined;
        keyPoints?: string[] | undefined;
    }, {
        description?: string | undefined;
        isActive?: boolean | undefined;
        title?: string | undefined;
        difficulty?: "easy" | "medium" | "hard" | undefined;
        videoUrl?: string | undefined;
        thumbnail?: string | undefined;
        duration?: string | undefined;
        order?: number | undefined;
        keyPoints?: string[] | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        lessonId: string;
        pathId: string;
    };
    body: {
        description?: string | undefined;
        isActive?: boolean | undefined;
        title?: string | undefined;
        difficulty?: "easy" | "medium" | "hard" | undefined;
        videoUrl?: string | undefined;
        thumbnail?: string | undefined;
        duration?: string | undefined;
        order?: number | undefined;
        keyPoints?: string[] | undefined;
    };
}, {
    params: {
        lessonId: string;
        pathId: string;
    };
    body: {
        description?: string | undefined;
        isActive?: boolean | undefined;
        title?: string | undefined;
        difficulty?: "easy" | "medium" | "hard" | undefined;
        videoUrl?: string | undefined;
        thumbnail?: string | undefined;
        duration?: string | undefined;
        order?: number | undefined;
        keyPoints?: string[] | undefined;
    };
}>;
export declare const schemeFiltersSchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodDefault<z.ZodNumber>;
        limit: z.ZodDefault<z.ZodNumber>;
        category: z.ZodOptional<z.ZodString>;
        isVerified: z.ZodOptional<z.ZodEnum<["true", "false"]>>;
        isActive: z.ZodOptional<z.ZodEnum<["true", "false"]>>;
        state: z.ZodOptional<z.ZodString>;
        search: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        limit: number;
        page: number;
        state?: string | undefined;
        category?: string | undefined;
        search?: string | undefined;
        isActive?: "true" | "false" | undefined;
        isVerified?: "true" | "false" | undefined;
    }, {
        state?: string | undefined;
        category?: string | undefined;
        search?: string | undefined;
        limit?: number | undefined;
        isActive?: "true" | "false" | undefined;
        isVerified?: "true" | "false" | undefined;
        page?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        limit: number;
        page: number;
        state?: string | undefined;
        category?: string | undefined;
        search?: string | undefined;
        isActive?: "true" | "false" | undefined;
        isVerified?: "true" | "false" | undefined;
    };
}, {
    query: {
        state?: string | undefined;
        category?: string | undefined;
        search?: string | undefined;
        limit?: number | undefined;
        isActive?: "true" | "false" | undefined;
        isVerified?: "true" | "false" | undefined;
        page?: number | undefined;
    };
}>;
export declare const createSchemeSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        description: z.ZodString;
        eligibility: z.ZodArray<z.ZodString, "many">;
        benefits: z.ZodArray<z.ZodString, "many">;
        requiredDocuments: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        applicationProcess: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        matchPercentage: z.ZodDefault<z.ZodNumber>;
        category: z.ZodString;
        deadline: z.ZodOptional<z.ZodString>;
        officialWebsite: z.ZodOptional<z.ZodString>;
        targetGroup: z.ZodOptional<z.ZodString>;
        stateAvailability: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        lastVerified: z.ZodOptional<z.ZodString>;
        isVerified: z.ZodDefault<z.ZodBoolean>;
        isActive: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        category: string;
        description: string;
        isActive: boolean;
        matchPercentage: number;
        eligibility: string[];
        benefits: string[];
        isVerified: boolean;
        requiredDocuments?: string[] | undefined;
        applicationProcess?: string[] | undefined;
        deadline?: string | undefined;
        officialWebsite?: string | undefined;
        targetGroup?: string | undefined;
        stateAvailability?: string[] | undefined;
        lastVerified?: string | undefined;
    }, {
        name: string;
        category: string;
        description: string;
        eligibility: string[];
        benefits: string[];
        isActive?: boolean | undefined;
        matchPercentage?: number | undefined;
        requiredDocuments?: string[] | undefined;
        applicationProcess?: string[] | undefined;
        deadline?: string | undefined;
        officialWebsite?: string | undefined;
        targetGroup?: string | undefined;
        stateAvailability?: string[] | undefined;
        lastVerified?: string | undefined;
        isVerified?: boolean | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        name: string;
        category: string;
        description: string;
        isActive: boolean;
        matchPercentage: number;
        eligibility: string[];
        benefits: string[];
        isVerified: boolean;
        requiredDocuments?: string[] | undefined;
        applicationProcess?: string[] | undefined;
        deadline?: string | undefined;
        officialWebsite?: string | undefined;
        targetGroup?: string | undefined;
        stateAvailability?: string[] | undefined;
        lastVerified?: string | undefined;
    };
}, {
    body: {
        name: string;
        category: string;
        description: string;
        eligibility: string[];
        benefits: string[];
        isActive?: boolean | undefined;
        matchPercentage?: number | undefined;
        requiredDocuments?: string[] | undefined;
        applicationProcess?: string[] | undefined;
        deadline?: string | undefined;
        officialWebsite?: string | undefined;
        targetGroup?: string | undefined;
        stateAvailability?: string[] | undefined;
        lastVerified?: string | undefined;
        isVerified?: boolean | undefined;
    };
}>;
export declare const updateSchemeSchema: z.ZodObject<{
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
        eligibility: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        benefits: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        requiredDocuments: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        applicationProcess: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        matchPercentage: z.ZodOptional<z.ZodNumber>;
        category: z.ZodOptional<z.ZodString>;
        deadline: z.ZodOptional<z.ZodString>;
        officialWebsite: z.ZodOptional<z.ZodString>;
        targetGroup: z.ZodOptional<z.ZodString>;
        stateAvailability: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        lastVerified: z.ZodOptional<z.ZodString>;
        isVerified: z.ZodOptional<z.ZodBoolean>;
        isActive: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        name?: string | undefined;
        category?: string | undefined;
        description?: string | undefined;
        isActive?: boolean | undefined;
        matchPercentage?: number | undefined;
        eligibility?: string[] | undefined;
        benefits?: string[] | undefined;
        requiredDocuments?: string[] | undefined;
        applicationProcess?: string[] | undefined;
        deadline?: string | undefined;
        officialWebsite?: string | undefined;
        targetGroup?: string | undefined;
        stateAvailability?: string[] | undefined;
        lastVerified?: string | undefined;
        isVerified?: boolean | undefined;
    }, {
        name?: string | undefined;
        category?: string | undefined;
        description?: string | undefined;
        isActive?: boolean | undefined;
        matchPercentage?: number | undefined;
        eligibility?: string[] | undefined;
        benefits?: string[] | undefined;
        requiredDocuments?: string[] | undefined;
        applicationProcess?: string[] | undefined;
        deadline?: string | undefined;
        officialWebsite?: string | undefined;
        targetGroup?: string | undefined;
        stateAvailability?: string[] | undefined;
        lastVerified?: string | undefined;
        isVerified?: boolean | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        name?: string | undefined;
        category?: string | undefined;
        description?: string | undefined;
        isActive?: boolean | undefined;
        matchPercentage?: number | undefined;
        eligibility?: string[] | undefined;
        benefits?: string[] | undefined;
        requiredDocuments?: string[] | undefined;
        applicationProcess?: string[] | undefined;
        deadline?: string | undefined;
        officialWebsite?: string | undefined;
        targetGroup?: string | undefined;
        stateAvailability?: string[] | undefined;
        lastVerified?: string | undefined;
        isVerified?: boolean | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        name?: string | undefined;
        category?: string | undefined;
        description?: string | undefined;
        isActive?: boolean | undefined;
        matchPercentage?: number | undefined;
        eligibility?: string[] | undefined;
        benefits?: string[] | undefined;
        requiredDocuments?: string[] | undefined;
        applicationProcess?: string[] | undefined;
        deadline?: string | undefined;
        officialWebsite?: string | undefined;
        targetGroup?: string | undefined;
        stateAvailability?: string[] | undefined;
        lastVerified?: string | undefined;
        isVerified?: boolean | undefined;
    };
}>;
export declare const productFiltersSchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodDefault<z.ZodNumber>;
        limit: z.ZodDefault<z.ZodNumber>;
        category: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodEnum<["draft", "active", "inactive"]>>;
        moderationStatus: z.ZodOptional<z.ZodEnum<["pending", "approved", "rejected"]>>;
        search: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        limit: number;
        page: number;
        category?: string | undefined;
        search?: string | undefined;
        status?: "draft" | "active" | "inactive" | undefined;
        moderationStatus?: "pending" | "approved" | "rejected" | undefined;
    }, {
        category?: string | undefined;
        search?: string | undefined;
        limit?: number | undefined;
        status?: "draft" | "active" | "inactive" | undefined;
        moderationStatus?: "pending" | "approved" | "rejected" | undefined;
        page?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        limit: number;
        page: number;
        category?: string | undefined;
        search?: string | undefined;
        status?: "draft" | "active" | "inactive" | undefined;
        moderationStatus?: "pending" | "approved" | "rejected" | undefined;
    };
}, {
    query: {
        category?: string | undefined;
        search?: string | undefined;
        limit?: number | undefined;
        status?: "draft" | "active" | "inactive" | undefined;
        moderationStatus?: "pending" | "approved" | "rejected" | undefined;
        page?: number | undefined;
    };
}>;
export declare const productModerationSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        moderationStatus: z.ZodEnum<["pending", "approved", "rejected"]>;
        moderationNote: z.ZodOptional<z.ZodString>;
        category: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodEnum<["draft", "active", "inactive"]>>;
    }, "strip", z.ZodTypeAny, {
        moderationStatus: "pending" | "approved" | "rejected";
        category?: string | undefined;
        status?: "draft" | "active" | "inactive" | undefined;
        moderationNote?: string | undefined;
    }, {
        moderationStatus: "pending" | "approved" | "rejected";
        category?: string | undefined;
        status?: "draft" | "active" | "inactive" | undefined;
        moderationNote?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        moderationStatus: "pending" | "approved" | "rejected";
        category?: string | undefined;
        status?: "draft" | "active" | "inactive" | undefined;
        moderationNote?: string | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        moderationStatus: "pending" | "approved" | "rejected";
        category?: string | undefined;
        status?: "draft" | "active" | "inactive" | undefined;
        moderationNote?: string | undefined;
    };
}>;
export declare const buyerFiltersSchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodDefault<z.ZodNumber>;
        limit: z.ZodDefault<z.ZodNumber>;
        type: z.ZodOptional<z.ZodEnum<["individual", "business", "wholesaler", "retailer", "exporter"]>>;
        location: z.ZodOptional<z.ZodString>;
        verified: z.ZodOptional<z.ZodEnum<["true", "false"]>>;
        isActive: z.ZodOptional<z.ZodEnum<["true", "false"]>>;
        search: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        limit: number;
        page: number;
        type?: "individual" | "business" | "wholesaler" | "retailer" | "exporter" | undefined;
        search?: string | undefined;
        location?: string | undefined;
        isActive?: "true" | "false" | undefined;
        verified?: "true" | "false" | undefined;
    }, {
        type?: "individual" | "business" | "wholesaler" | "retailer" | "exporter" | undefined;
        search?: string | undefined;
        limit?: number | undefined;
        location?: string | undefined;
        isActive?: "true" | "false" | undefined;
        verified?: "true" | "false" | undefined;
        page?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        limit: number;
        page: number;
        type?: "individual" | "business" | "wholesaler" | "retailer" | "exporter" | undefined;
        search?: string | undefined;
        location?: string | undefined;
        isActive?: "true" | "false" | undefined;
        verified?: "true" | "false" | undefined;
    };
}, {
    query: {
        type?: "individual" | "business" | "wholesaler" | "retailer" | "exporter" | undefined;
        search?: string | undefined;
        limit?: number | undefined;
        location?: string | undefined;
        isActive?: "true" | "false" | undefined;
        verified?: "true" | "false" | undefined;
        page?: number | undefined;
    };
}>;
export declare const createBuyerSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        type: z.ZodEnum<["individual", "business", "wholesaler", "retailer", "exporter"]>;
        location: z.ZodString;
        requiredProduct: z.ZodString;
        quantity: z.ZodNumber;
        budget: z.ZodNumber;
        matchPercentage: z.ZodDefault<z.ZodNumber>;
        contactInfo: z.ZodOptional<z.ZodObject<{
            phone: z.ZodOptional<z.ZodString>;
            email: z.ZodOptional<z.ZodString>;
            address: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            phone?: string | undefined;
            email?: string | undefined;
            address?: string | undefined;
        }, {
            phone?: string | undefined;
            email?: string | undefined;
            address?: string | undefined;
        }>>;
        verified: z.ZodDefault<z.ZodBoolean>;
        isActive: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        type: "individual" | "business" | "wholesaler" | "retailer" | "exporter";
        name: string;
        location: string;
        isActive: boolean;
        matchPercentage: number;
        requiredProduct: string;
        quantity: number;
        budget: number;
        verified: boolean;
        contactInfo?: {
            phone?: string | undefined;
            email?: string | undefined;
            address?: string | undefined;
        } | undefined;
    }, {
        type: "individual" | "business" | "wholesaler" | "retailer" | "exporter";
        name: string;
        location: string;
        requiredProduct: string;
        quantity: number;
        budget: number;
        isActive?: boolean | undefined;
        matchPercentage?: number | undefined;
        contactInfo?: {
            phone?: string | undefined;
            email?: string | undefined;
            address?: string | undefined;
        } | undefined;
        verified?: boolean | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        type: "individual" | "business" | "wholesaler" | "retailer" | "exporter";
        name: string;
        location: string;
        isActive: boolean;
        matchPercentage: number;
        requiredProduct: string;
        quantity: number;
        budget: number;
        verified: boolean;
        contactInfo?: {
            phone?: string | undefined;
            email?: string | undefined;
            address?: string | undefined;
        } | undefined;
    };
}, {
    body: {
        type: "individual" | "business" | "wholesaler" | "retailer" | "exporter";
        name: string;
        location: string;
        requiredProduct: string;
        quantity: number;
        budget: number;
        isActive?: boolean | undefined;
        matchPercentage?: number | undefined;
        contactInfo?: {
            phone?: string | undefined;
            email?: string | undefined;
            address?: string | undefined;
        } | undefined;
        verified?: boolean | undefined;
    };
}>;
export declare const updateBuyerSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        type: z.ZodOptional<z.ZodEnum<["individual", "business", "wholesaler", "retailer", "exporter"]>>;
        location: z.ZodOptional<z.ZodString>;
        requiredProduct: z.ZodOptional<z.ZodString>;
        quantity: z.ZodOptional<z.ZodNumber>;
        budget: z.ZodOptional<z.ZodNumber>;
        matchPercentage: z.ZodOptional<z.ZodNumber>;
        contactInfo: z.ZodOptional<z.ZodObject<{
            phone: z.ZodOptional<z.ZodString>;
            email: z.ZodOptional<z.ZodString>;
            address: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            phone?: string | undefined;
            email?: string | undefined;
            address?: string | undefined;
        }, {
            phone?: string | undefined;
            email?: string | undefined;
            address?: string | undefined;
        }>>;
        verified: z.ZodOptional<z.ZodBoolean>;
        isActive: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        type?: "individual" | "business" | "wholesaler" | "retailer" | "exporter" | undefined;
        name?: string | undefined;
        location?: string | undefined;
        isActive?: boolean | undefined;
        matchPercentage?: number | undefined;
        requiredProduct?: string | undefined;
        quantity?: number | undefined;
        budget?: number | undefined;
        contactInfo?: {
            phone?: string | undefined;
            email?: string | undefined;
            address?: string | undefined;
        } | undefined;
        verified?: boolean | undefined;
    }, {
        type?: "individual" | "business" | "wholesaler" | "retailer" | "exporter" | undefined;
        name?: string | undefined;
        location?: string | undefined;
        isActive?: boolean | undefined;
        matchPercentage?: number | undefined;
        requiredProduct?: string | undefined;
        quantity?: number | undefined;
        budget?: number | undefined;
        contactInfo?: {
            phone?: string | undefined;
            email?: string | undefined;
            address?: string | undefined;
        } | undefined;
        verified?: boolean | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        type?: "individual" | "business" | "wholesaler" | "retailer" | "exporter" | undefined;
        name?: string | undefined;
        location?: string | undefined;
        isActive?: boolean | undefined;
        matchPercentage?: number | undefined;
        requiredProduct?: string | undefined;
        quantity?: number | undefined;
        budget?: number | undefined;
        contactInfo?: {
            phone?: string | undefined;
            email?: string | undefined;
            address?: string | undefined;
        } | undefined;
        verified?: boolean | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        type?: "individual" | "business" | "wholesaler" | "retailer" | "exporter" | undefined;
        name?: string | undefined;
        location?: string | undefined;
        isActive?: boolean | undefined;
        matchPercentage?: number | undefined;
        requiredProduct?: string | undefined;
        quantity?: number | undefined;
        budget?: number | undefined;
        contactInfo?: {
            phone?: string | undefined;
            email?: string | undefined;
            address?: string | undefined;
        } | undefined;
        verified?: boolean | undefined;
    };
}>;
export declare const marketRequestFiltersSchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodDefault<z.ZodNumber>;
        limit: z.ZodDefault<z.ZodNumber>;
        type: z.ZodOptional<z.ZodEnum<["connect", "rfq", "order"]>>;
        status: z.ZodOptional<z.ZodEnum<["pending", "accepted", "rejected", "completed"]>>;
        search: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        limit: number;
        page: number;
        type?: "order" | "connect" | "rfq" | undefined;
        search?: string | undefined;
        status?: "pending" | "rejected" | "accepted" | "completed" | undefined;
    }, {
        type?: "order" | "connect" | "rfq" | undefined;
        search?: string | undefined;
        limit?: number | undefined;
        status?: "pending" | "rejected" | "accepted" | "completed" | undefined;
        page?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        limit: number;
        page: number;
        type?: "order" | "connect" | "rfq" | undefined;
        search?: string | undefined;
        status?: "pending" | "rejected" | "accepted" | "completed" | undefined;
    };
}, {
    query: {
        type?: "order" | "connect" | "rfq" | undefined;
        search?: string | undefined;
        limit?: number | undefined;
        status?: "pending" | "rejected" | "accepted" | "completed" | undefined;
        page?: number | undefined;
    };
}>;
export declare const orderFiltersSchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodDefault<z.ZodNumber>;
        limit: z.ZodDefault<z.ZodNumber>;
        status: z.ZodOptional<z.ZodEnum<["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "returned"]>>;
        paymentStatus: z.ZodOptional<z.ZodEnum<["pending", "paid", "partial", "refunded", "failed"]>>;
        search: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        limit: number;
        page: number;
        search?: string | undefined;
        status?: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "returned" | undefined;
        paymentStatus?: "partial" | "pending" | "paid" | "refunded" | "failed" | undefined;
    }, {
        search?: string | undefined;
        limit?: number | undefined;
        status?: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "returned" | undefined;
        paymentStatus?: "partial" | "pending" | "paid" | "refunded" | "failed" | undefined;
        page?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        limit: number;
        page: number;
        search?: string | undefined;
        status?: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "returned" | undefined;
        paymentStatus?: "partial" | "pending" | "paid" | "refunded" | "failed" | undefined;
    };
}, {
    query: {
        search?: string | undefined;
        limit?: number | undefined;
        status?: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "returned" | undefined;
        paymentStatus?: "partial" | "pending" | "paid" | "refunded" | "failed" | undefined;
        page?: number | undefined;
    };
}>;
export declare const auditLogFiltersSchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodDefault<z.ZodNumber>;
        limit: z.ZodDefault<z.ZodNumber>;
        action: z.ZodOptional<z.ZodEnum<["create", "update", "delete", "suspend", "activate", "approve", "reject", "verify", "login", "export", "settings"]>>;
        resource: z.ZodOptional<z.ZodString>;
        adminId: z.ZodOptional<z.ZodString>;
        dateFrom: z.ZodOptional<z.ZodString>;
        dateTo: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        limit: number;
        page: number;
        adminId?: string | undefined;
        action?: "create" | "update" | "delete" | "suspend" | "activate" | "approve" | "reject" | "verify" | "login" | "export" | "settings" | undefined;
        resource?: string | undefined;
        dateFrom?: string | undefined;
        dateTo?: string | undefined;
    }, {
        limit?: number | undefined;
        adminId?: string | undefined;
        action?: "create" | "update" | "delete" | "suspend" | "activate" | "approve" | "reject" | "verify" | "login" | "export" | "settings" | undefined;
        resource?: string | undefined;
        page?: number | undefined;
        dateFrom?: string | undefined;
        dateTo?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        limit: number;
        page: number;
        adminId?: string | undefined;
        action?: "create" | "update" | "delete" | "suspend" | "activate" | "approve" | "reject" | "verify" | "login" | "export" | "settings" | undefined;
        resource?: string | undefined;
        dateFrom?: string | undefined;
        dateTo?: string | undefined;
    };
}, {
    query: {
        limit?: number | undefined;
        adminId?: string | undefined;
        action?: "create" | "update" | "delete" | "suspend" | "activate" | "approve" | "reject" | "verify" | "login" | "export" | "settings" | undefined;
        resource?: string | undefined;
        page?: number | undefined;
        dateFrom?: string | undefined;
        dateTo?: string | undefined;
    };
}>;
export declare const analyticsSchema: z.ZodObject<{
    query: z.ZodObject<{
        period: z.ZodDefault<z.ZodEnum<["7d", "30d", "90d", "all"]>>;
    }, "strip", z.ZodTypeAny, {
        period: "7d" | "30d" | "90d" | "all";
    }, {
        period?: "7d" | "30d" | "90d" | "all" | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        period: "7d" | "30d" | "90d" | "all";
    };
}, {
    query: {
        period?: "7d" | "30d" | "90d" | "all" | undefined;
    };
}>;
//# sourceMappingURL=admin.d.ts.map