export type ProficiencyLevel = 1 | 2 | 3 | 4 | 5;

export interface Skill {
    id: string;
    name: string;
    category: string;
    subcategory: string;
    proficiency: ProficiencyLevel;
    verified: boolean;
    yearsOfExperience?: number;
    certificationUrl?: string;
    notes?: string;
    tags?: string[];
}

export interface Tag {
    id: string;
    name: string;
    color: string;
    description: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    department: string;
    avatarUrl?: string;
    tenure: string;
    skills: Skill[];
    // Resource Management fields
    title?: string;
    location?: string;
    status?: 'Active' | 'Inactive';
    isAdmin?: boolean;
}

export interface TaxonomySubcategory {
    name: string;
    skills: string[];
}

export interface TaxonomyCategory {
    name: string;
    description: string;
    subcategories: TaxonomySubcategory[];
}

export const PROFICIENCY_DESCRIPTIONS: Record<ProficiencyLevel, string> = {
    1: 'Novice: Understands basic concepts; requires full supervision.',
    2: 'Learner: Can perform basic tasks; requires frequent guidance.',
    3: 'Competent: Independent worker; can solve standard problems.',
    4: 'Advanced: Specialist; can mentor others and handle complex edge cases.',
    5: 'Expert: Thought leader; defines standards and strategy for this skill.',
};

// Project Management Types
export type ProjectStatus = 'Pipeline' | 'Active' | 'Completed' | 'On Hold';
export type AssignmentStatus = 'Active' | 'Proposed' | 'Past';
export type BookingType = 'Hard' | 'Soft';

export interface SkillRequirement {
    skillName: string;
    category: string;
    subcategory: string;
    minProficiency: ProficiencyLevel;
}

export interface ProjectRole {
    id: string;
    projectId: string;
    roleTitle: string;
    count: number;
    requiredSkills: SkillRequirement[];
    softSkillPreferences?: string[];
    description?: string;
}

export interface ProjectAssignment {
    id: string;
    projectId: string;
    userId: string;
    roleId: string;
    roleTitle: string;
    allocationPercent: number;
    startDate: string;
    endDate: string;
    status: AssignmentStatus;
    bookingType: BookingType;
    notes?: string;
}

export interface Project {
    id: string;
    name: string;
    clientName: string;
    projectCode: string;
    startDate: string;
    endDate: string;
    description: string;
    status: ProjectStatus;
    ownerId: string;
}

export interface UserUtilization {
    userId: string;
    totalAllocation: number;
    assignments: {
        projectId: string;
        projectName: string;
        allocation: number;
        startDate: string;
        endDate: string;
    }[];
}

export interface SkillMatchResult {
    user: User;
    matchPercentage: number;
    matchedSkills: {
        skillName: string;
        required: ProficiencyLevel;
        actual: ProficiencyLevel;
    }[];
    missingSkills: SkillRequirement[];
    utilization: UserUtilization;
}

// Resource Management Types
export type GroupType = 'Department' | 'Practice' | 'Squad';
export type UserStatus = 'Active' | 'Inactive';

export interface Group {
    id: string;
    name: string;
    type: GroupType;
    ownerId?: string;
    parentGroupId?: string;
    description?: string;
}

export interface UserGroup {
    userId: string;
    groupId: string;
    isPrimary: boolean;
}

export interface Payband {
    id: string;
    code: string;
    label: string;
    minSalary: number;
    maxSalary: number;
}

export interface RateCard {
    id: string;
    name: string;
    hourlyRate: number;
    currency: string;
    effectiveDate: string;
}

export interface UserFinancials {
    userId: string;
    paybandId?: string;
    rateCardId?: string;
    customRate?: number;
    customRateCurrency?: string;
    effectiveDate: string;
}

