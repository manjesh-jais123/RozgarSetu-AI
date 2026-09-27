import mongoose, { Document } from 'mongoose';
export interface ISkillMaster extends Document {
    name: string;
    category: string;
    description?: string;
    proficiency: 'beginner' | 'intermediate' | 'advanced';
    yearsExperience: number;
    learningResourceUrl?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Skill: mongoose.Model<ISkillMaster, {}, {}, {}, mongoose.Document<unknown, {}, ISkillMaster, {}, {}> & ISkillMaster & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Skill.d.ts.map