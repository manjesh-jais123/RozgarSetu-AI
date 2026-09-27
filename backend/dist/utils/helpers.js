"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseQueryFilters = exports.slugify = exports.sleep = exports.calculateDistance = exports.calculateMatchPercentage = exports.isValidPhoneNumber = exports.formatPhoneNumber = exports.generateOTP = void 0;
const generateOTP = (length = 6) => {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += digits[Math.floor(Math.random() * digits.length)];
    }
    return otp;
};
exports.generateOTP = generateOTP;
const formatPhoneNumber = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('91') && cleaned.length === 12) {
        return `+${cleaned}`;
    }
    if (cleaned.length === 10) {
        return `+91${cleaned}`;
    }
    return phone;
};
exports.formatPhoneNumber = formatPhoneNumber;
const isValidPhoneNumber = (phone) => {
    const formatted = (0, exports.formatPhoneNumber)(phone);
    return /^\+91\d{10}$/.test(formatted);
};
exports.isValidPhoneNumber = isValidPhoneNumber;
const calculateMatchPercentage = (userSkills, requiredSkills) => {
    if (!requiredSkills.length)
        return 100;
    const userSkillSet = new Set(userSkills.map(s => s.toLowerCase()));
    const matches = requiredSkills.filter(s => userSkillSet.has(s.toLowerCase())).length;
    return Math.round((matches / requiredSkills.length) * 100);
};
exports.calculateMatchPercentage = calculateMatchPercentage;
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};
exports.calculateDistance = calculateDistance;
const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
exports.sleep = sleep;
const slugify = (text) => {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};
exports.slugify = slugify;
const parseQueryFilters = (query) => {
    const filters = {};
    for (const [key, value] of Object.entries(query)) {
        if (value !== undefined && value !== '') {
            if (key === 'page' || key === 'limit' || key === 'sort' || key === 'search')
                continue;
            try {
                filters[key] = JSON.parse(value);
            }
            catch {
                filters[key] = value;
            }
        }
    }
    return filters;
};
exports.parseQueryFilters = parseQueryFilters;
//# sourceMappingURL=helpers.js.map