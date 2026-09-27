"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const errorHandler_1 = require("../middleware/errorHandler");
const types_1 = require("../utils/types");
exports.userController = {
    getProfile: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const authReq = req;
        const user = authReq.user;
        res.json((0, types_1.successResponse)('Profile retrieved', sanitizeUser(user)));
    }),
    updateProfile: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const authReq = req;
        const user = authReq.user;
        const { name, language, avatar } = req.body;
        if (name)
            user.name = name;
        if (language)
            user.language = language;
        if (avatar)
            user.avatar = avatar;
        await user.save();
        res.json((0, types_1.successResponse)('Profile updated', sanitizeUser(user)));
    }),
    updateBasicInfo: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const authReq = req;
        const user = authReq.user;
        const { age, gender, education, workExperience, location } = req.body;
        if (age !== undefined)
            user.profile.age = age;
        if (gender)
            user.profile.gender = gender;
        if (education !== undefined)
            user.profile.education = education;
        if (workExperience !== undefined)
            user.profile.workExperience = workExperience;
        if (location) {
            user.location = { ...user.location, ...location };
        }
        await user.save();
        res.json((0, types_1.successResponse)('Basic info updated', sanitizeUser(user)));
    }),
    updateSkills: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const authReq = req;
        const user = authReq.user;
        const { skills } = req.body;
        user.profile.skills = skills;
        await user.save();
        res.json((0, types_1.successResponse)('Skills updated', sanitizeUser(user)));
    }),
    updateInterests: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const authReq = req;
        const user = authReq.user;
        const { interests, businessInterest } = req.body;
        if (interests)
            user.profile.interests = interests;
        if (businessInterest)
            user.profile.businessInterest = businessInterest;
        await user.save();
        res.json((0, types_1.successResponse)('Interests updated', sanitizeUser(user)));
    }),
    updateFinancialInfo: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const authReq = req;
        const user = authReq.user;
        const { availableCapital, expectedIncome, currentIncome, investmentCapacity } = req.body;
        if (availableCapital !== undefined)
            user.profile.financialInfo.availableCapital = availableCapital;
        if (expectedIncome !== undefined)
            user.profile.financialInfo.expectedIncome = expectedIncome;
        if (currentIncome !== undefined)
            user.profile.financialInfo.currentIncome = currentIncome;
        if (investmentCapacity !== undefined)
            user.profile.financialInfo.investmentCapacity = investmentCapacity;
        await user.save();
        res.json((0, types_1.successResponse)('Financial info updated', sanitizeUser(user)));
    }),
    updateGoals: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const authReq = req;
        const user = authReq.user;
        const { goals } = req.body;
        user.profile.goals = goals;
        await user.save();
        res.json((0, types_1.successResponse)('Goals updated', sanitizeUser(user)));
    }),
    completeOnboarding: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const authReq = req;
        const user = authReq.user;
        user.onboardingCompleted = true;
        await user.save();
        res.json((0, types_1.successResponse)('Onboarding completed', sanitizeUser(user)));
    }),
    deleteAccount: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const authReq = req;
        const user = authReq.user;
        user.isActive = false;
        await user.save();
        res.json((0, types_1.successResponse)('Account deactivated', null));
    }),
};
function sanitizeUser(user) {
    const obj = user.toObject();
    delete obj.refreshTokens;
    delete obj.password;
    return obj;
}
//# sourceMappingURL=user.controller.js.map