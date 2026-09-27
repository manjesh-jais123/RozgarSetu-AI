"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.opportunityController = void 0;
const models_1 = require("../models");
const errorHandler_1 = require("../middleware/errorHandler");
const types_1 = require("../utils/types");
const helpers_1 = require("../utils/helpers");
exports.opportunityController = {
    list: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { page = 1, limit = 10, category, difficulty, minInvestment, maxInvestment, skill, location, search, sort = 'matchPercentage', order = 'desc' } = req.query;
        const filter = { isActive: true };
        if (category)
            filter.category = category;
        if (difficulty)
            filter.difficulty = difficulty;
        if (location)
            filter.location = location;
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $regex: search, $options: 'i' } },
            ];
        }
        if (minInvestment || maxInvestment) {
            filter.requiredInvestment = {};
            if (minInvestment)
                filter.requiredInvestment.min = { $gte: Number(minInvestment) };
            if (maxInvestment)
                filter.requiredInvestment.max = { $lte: Number(maxInvestment) };
        }
        const skip = (Number(page) - 1) * Number(limit);
        const sortObj = { [sort]: order === 'asc' ? 1 : -1 };
        const [opportunities, total] = await Promise.all([
            models_1.Opportunity.find(filter)
                .sort(sortObj)
                .skip(skip)
                .limit(Number(limit))
                .lean(),
            models_1.Opportunity.countDocuments(filter),
        ]);
        let results = opportunities;
        if (skill) {
            const userSkill = String(skill).toLowerCase();
            results = results.map(opp => ({
                ...opp,
                matchPercentage: calculateMatchPercentage([userSkill], opp.requiredSkills),
            })).sort((a, b) => b.matchPercentage - a.matchPercentage);
        }
        res.json((0, types_1.successResponse)('Opportunities retrieved', (0, types_1.createPaginatedResponse)(results, total, Number(page), Number(limit))));
    }),
    get: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const opportunity = await models_1.Opportunity.findById(id).lean();
        if (!opportunity) {
            throw new errorHandler_1.AppError('Opportunity not found', 404, 'OPPORTUNITY_NOT_FOUND');
        }
        res.json((0, types_1.successResponse)('Opportunity retrieved', opportunity));
    }),
    recommend: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const authReq = req;
        const user = authReq.user;
        const userSkills = user.profile.skills.map((s) => s.name.toLowerCase());
        const userInterests = user.profile.interests.map((i) => i.name.toLowerCase());
        const userBusinessInterests = user.profile.businessInterest.map((b) => b.name.toLowerCase());
        const opportunities = await models_1.Opportunity.find({ isActive: true }).lean();
        const scored = opportunities.map(opp => {
            const skillMatch = calculateMatchPercentage(userSkills, opp.requiredSkills);
            const interestMatch = opp.tags.some((tag) => userInterests.some((ui) => tag.toLowerCase().includes(ui)) ||
                userBusinessInterests.some((ubi) => tag.toLowerCase().includes(ubi))) ? 20 : 0;
            const locationMatch = user.location.state && opp.location &&
                opp.location.toLowerCase().includes(user.location.state.toLowerCase()) ? 15 : 0;
            const totalMatch = Math.min(100, Math.round(opp.matchPercentage * 0.6 + skillMatch * 0.3 + interestMatch + locationMatch));
            return { ...opp, matchPercentage: totalMatch };
        });
        const recommended = scored
            .filter(o => o.matchPercentage > 50)
            .sort((a, b) => b.matchPercentage - a.matchPercentage)
            .slice(0, 10);
        res.json((0, types_1.successResponse)('Recommended opportunities', recommended));
    }),
    filter: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const filters = (0, helpers_1.parseQueryFilters)(req.query);
        const { page = 1, limit = 10 } = req.query;
        const filter = { isActive: true };
        if (filters.budget) {
            filter.requiredInvestment = {
                min: { $lte: Number(filters.budget) },
                max: { $gte: Number(filters.budget) },
            };
        }
        if (filters.difficulty)
            filter.difficulty = filters.difficulty;
        if (filters.category)
            filter.category = filters.category;
        if (filters.skill) {
            filter.requiredSkills = { $in: [new RegExp(filters.skill, 'i')] };
        }
        const skip = (Number(page) - 1) * Number(limit);
        const [opportunities, total] = await Promise.all([
            models_1.Opportunity.find(filter).skip(skip).limit(Number(limit)).lean(),
            models_1.Opportunity.countDocuments(filter),
        ]);
        res.json((0, types_1.successResponse)('Filtered opportunities', (0, types_1.createPaginatedResponse)(opportunities, total, Number(page), Number(limit))));
    }),
    categories: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const categories = await models_1.Opportunity.distinct('category', { isActive: true });
        res.json((0, types_1.successResponse)('Categories retrieved', categories));
    }),
    create: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const authReq = req;
        const user = authReq.user;
        const opportunity = await models_1.Opportunity.create({ ...req.body, createdBy: user._id });
        res.status(201).json((0, types_1.successResponse)('Opportunity created', opportunity));
    }),
    update: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const opportunity = await models_1.Opportunity.findByIdAndUpdate(id, req.body, { new: true });
        if (!opportunity) {
            throw new errorHandler_1.AppError('Opportunity not found', 404, 'OPPORTUNITY_NOT_FOUND');
        }
        res.json((0, types_1.successResponse)('Opportunity updated', opportunity));
    }),
    delete: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const opportunity = await models_1.Opportunity.findByIdAndUpdate(id, { isActive: false }, { new: true });
        if (!opportunity) {
            throw new errorHandler_1.AppError('Opportunity not found', 404, 'OPPORTUNITY_NOT_FOUND');
        }
        res.json((0, types_1.successResponse)('Opportunity deleted', null));
    }),
};
function calculateMatchPercentage(userSkills, requiredSkills) {
    if (!requiredSkills.length)
        return 100;
    const userSkillSet = new Set(userSkills);
    const matches = requiredSkills.filter(s => userSkillSet.has(s.toLowerCase())).length;
    return Math.round((matches / requiredSkills.length) * 100);
}
//# sourceMappingURL=opportunity.controller.js.map