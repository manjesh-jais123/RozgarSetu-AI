"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminSkillController = void 0;
const models_1 = require("../../models");
const errorHandler_1 = require("../../middleware/errorHandler");
const types_1 = require("../../utils/types");
const adminAuth_1 = require("../../middleware/adminAuth");
exports.adminSkillController = {
    list: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { page = 1, limit = 10, category, proficiency, isActive, search } = req.query;
        const filter = {};
        if (category)
            filter.category = category;
        if (proficiency)
            filter.proficiency = proficiency;
        if (isActive !== undefined)
            filter.isActive = isActive === 'true';
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } },
            ];
        }
        const [skills, total] = await Promise.all([
            models_1.Skill.find(filter)
                .sort({ createdAt: -1 })
                .skip((Number(page) - 1) * Number(limit))
                .limit(Number(limit))
                .lean(),
            models_1.Skill.countDocuments(filter),
        ]);
        const categories = await models_1.Skill.distinct('category', { isActive: true });
        res.json((0, types_1.successResponse)('Skills retrieved', {
            skills,
            categories,
            pagination: (0, types_1.createPaginatedResponse)(skills, total, Number(page), Number(limit)),
        }));
    }),
    get: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const skill = await models_1.Skill.findById(id).lean();
        if (!skill) {
            throw new errorHandler_1.AppError('Skill not found', 404, 'SKILL_NOT_FOUND');
        }
        res.json((0, types_1.successResponse)('Skill retrieved', skill));
    }),
    create: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const authReq = req;
        const admin = authReq.user;
        const skill = await models_1.Skill.create(req.body);
        void (0, adminAuth_1.createAuditLog)(admin._id.toString(), admin.phone, 'create', 'skill', skill._id?.toString(), { skill: req.body }, req);
        res.status(201).json((0, types_1.successResponse)('Skill created', skill));
    }),
    update: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const authReq = req;
        const admin = authReq.user;
        const skill = await models_1.Skill.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!skill) {
            throw new errorHandler_1.AppError('Skill not found', 404, 'SKILL_NOT_FOUND');
        }
        void (0, adminAuth_1.createAuditLog)(admin._id.toString(), admin.phone, 'update', 'skill', id, { updates: req.body }, req);
        res.json((0, types_1.successResponse)('Skill updated', skill));
    }),
    delete: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const authReq = req;
        const admin = authReq.user;
        const skill = await models_1.Skill.findByIdAndUpdate(id, { isActive: false }, { new: true });
        if (!skill) {
            throw new errorHandler_1.AppError('Skill not found', 404, 'SKILL_NOT_FOUND');
        }
        void (0, adminAuth_1.createAuditLog)(admin._id.toString(), admin.phone, 'deactivate', 'skill', id, {}, req);
        res.json((0, types_1.successResponse)('Skill deactivated', skill));
    }),
    getCategories: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const categories = await models_1.Skill.distinct('category', { isActive: true });
        const skillLevels = [
            { value: 'beginner', label: 'Beginner' },
            { value: 'intermediate', label: 'Intermediate' },
            { value: 'advanced', label: 'Advanced' },
        ];
        res.json((0, types_1.successResponse)('Categories and levels retrieved', { categories, skillLevels }));
    }),
};
//# sourceMappingURL=skill.controller.js.map