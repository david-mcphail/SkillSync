import { TAXONOMY, TAGS } from '../data/taxonomy';
import type {
    User,
    Skill,
    TaxonomyCategory,
    Tag,
    Project,
    ProjectRole,
    ProjectAssignment,
    SkillRequirement,
    UserUtilization,
    SkillMatchResult,
    ProficiencyLevel,
    SOW,
    ChangeRequest,
    Risk,
    Dependency,
    SupportingDocument,
    Group,
    UserGroup,
    Payband,
    RateCard,
    UserFinancials
} from '../types/models';

// Initialize categories from static data
let categories: TaxonomyCategory[] = [...TAXONOMY];

// Initialize tags from static data
let tags: Tag[] = [...TAGS];

// Initialize projects
let projects: Project[] = [
    {
        id: 'proj-1',
        name: 'Digital Banking Transformation',
        clientName: 'First National Bank',
        projectCode: 'FNB-2024-001',
        startDate: '2024-01-15',
        endDate: '2024-12-31',
        description: 'Complete overhaul of online banking platform with modern React frontend and microservices backend.',
        status: 'Active',
        ownerId: '1',
        portfolio: 'Financial Services'
    },
    {
        id: 'proj-2',
        name: 'Healthcare Portal Modernization',
        clientName: 'MediCare Systems',
        projectCode: 'MCS-2024-002',
        startDate: '2024-03-01',
        endDate: '2024-09-30',
        description: 'Migration of legacy patient portal to cloud-native architecture with enhanced security.',
        status: 'Active',
        ownerId: '1',
        portfolio: 'Healthcare'
    },
    {
        id: 'proj-3',
        name: 'E-Commerce Platform',
        clientName: 'RetailCo',
        projectCode: 'RTC-2024-003',
        startDate: '2024-06-01',
        endDate: '2025-03-31',
        description: 'Build new e-commerce platform with AI-powered recommendations and real-time inventory.',
        status: 'Pipeline',
        ownerId: '1',
        portfolio: 'Retail & Consumer'
    },
    {
        id: 'proj-4',
        name: 'Insurance Claims Automation',
        clientName: 'SafeGuard Insurance',
        projectCode: 'SGI-2023-004',
        startDate: '2023-09-01',
        endDate: '2024-02-28',
        description: 'Automated claims processing system using machine learning and workflow automation.',
        status: 'Completed',
        ownerId: '1',
        portfolio: 'Financial Services'
    }
];

// Initialize project roles
let projectRoles: ProjectRole[] = [
    {
        id: 'role-1',
        projectId: 'proj-1',
        roleTitle: 'Senior Backend Developer',
        count: 2,
        requiredSkills: [
            { skillName: 'Java', category: 'Application Development', subcategory: 'Languages', minProficiency: 4 },
            { skillName: 'Spring Boot', category: 'Application Development', subcategory: 'Backend Frameworks', minProficiency: 4 },
            { skillName: 'AWS', category: 'Platform Engineering', subcategory: 'Cloud Providers', minProficiency: 3 }
        ],
        softSkillPreferences: ['Mentoring', 'Client Facing'],
        description: 'Lead backend development for microservices architecture'
    },
    {
        id: 'role-2',
        projectId: 'proj-1',
        roleTitle: 'Frontend Architect',
        count: 1,
        requiredSkills: [
            { skillName: 'React', category: 'Application Development', subcategory: 'Frontend Frameworks', minProficiency: 5 },
            { skillName: 'TypeScript', category: 'Application Development', subcategory: 'Languages', minProficiency: 4 },
            { skillName: 'UI/UX Design', category: 'Domain Knowledge', subcategory: 'User Experience & Design', minProficiency: 3 }
        ],
        description: 'Design and implement frontend architecture'
    },
    {
        id: 'role-3',
        projectId: 'proj-2',
        roleTitle: 'Cloud Engineer',
        count: 1,
        requiredSkills: [
            { skillName: 'Azure', category: 'Platform Engineering', subcategory: 'Cloud Providers', minProficiency: 4 },
            { skillName: 'Kubernetes', category: 'Platform Engineering', subcategory: 'DevOps', minProficiency: 3 },
            { skillName: 'Terraform', category: 'Platform Engineering', subcategory: 'DevOps', minProficiency: 3 }
        ],
        description: 'Manage cloud infrastructure and deployment pipelines'
    },
    {
        id: 'role-4',
        projectId: 'proj-3',
        roleTitle: 'Full Stack Developer',
        count: 3,
        requiredSkills: [
            { skillName: 'Node.js', category: 'Application Development', subcategory: 'Backend Frameworks', minProficiency: 3 },
            { skillName: 'React', category: 'Application Development', subcategory: 'Frontend Frameworks', minProficiency: 3 },
            { skillName: 'TypeScript', category: 'Application Development', subcategory: 'Languages', minProficiency: 3 }
        ],
        description: 'Develop features across the full stack'
    }
];

// Initialize project assignments
let projectAssignments: ProjectAssignment[] = [
    {
        id: 'assign-1',
        projectId: 'proj-1',
        userId: '1',
        roleId: 'role-2',
        roleTitle: 'Frontend Architect',
        allocationPercent: 100,
        startDate: '2024-01-15',
        endDate: '2024-12-31',
        status: 'Active',
        bookingType: 'Hard',
        notes: 'Leading frontend architecture and mentoring junior developers'
    },
    {
        id: 'assign-2',
        projectId: 'proj-2',
        userId: '1',
        roleId: 'role-3',
        roleTitle: 'Cloud Engineer',
        allocationPercent: 50,
        startDate: '2024-03-01',
        endDate: '2024-06-30',
        status: 'Proposed',
        bookingType: 'Soft',
        notes: 'Part-time support for cloud migration'
    }
];

// Initialize SOWs
let sows: SOW[] = [
    {
        id: 'sow-1',
        projectId: 'proj-1',
        title: 'Digital Banking Platform Development - Phase 1',
        version: '1.0',
        status: 'Active',
        startDate: '2024-01-15',
        endDate: '2024-12-31',
        totalValue: 850000,
        currency: 'USD',
        scope: 'Complete overhaul of online banking platform including React frontend, microservices backend, and cloud infrastructure setup.',
        deliverables: [
            'React-based customer portal',
            'Microservices API layer',
            'Cloud infrastructure on AWS',
            'Security and compliance documentation',
            'User training materials'
        ],
        milestones: [
            { name: 'Requirements & Design', dueDate: '2024-03-15', payment: 170000, completed: true },
            { name: 'Frontend Development', dueDate: '2024-06-30', payment: 255000, completed: true },
            { name: 'Backend & Integration', dueDate: '2024-09-30', payment: 255000, completed: false },
            { name: 'Testing & Deployment', dueDate: '2024-12-31', payment: 170000, completed: false }
        ],
        createdDate: '2023-12-01',
        approvedDate: '2024-01-10',
        approvedBy: 'John Smith - VP Technology'
    }
];

// Initialize Change Requests
let changeRequests: ChangeRequest[] = [
    {
        id: 'cr-1',
        projectId: 'proj-1',
        sowId: 'sow-1',
        title: 'Add Mobile Banking Features',
        type: 'Scope Change',
        status: 'Approved',
        description: 'Client requests addition of mobile banking features including biometric authentication and mobile check deposit.',
        businessJustification: 'Market research shows 65% of customers prefer mobile banking. This feature will improve customer satisfaction and competitive positioning.',
        impactAnalysis: {
            scope: 'Additional 2 months of development for mobile features',
            timeline: 'Project end date extended to Feb 28, 2025',
            budget: 125000,
            resources: 'Requires 1 additional mobile developer'
        },
        requestedBy: 'Sarah Johnson - Product Owner',
        requestedDate: '2024-07-15',
        reviewedBy: 'Jane Doe - Technical Lead',
        reviewedDate: '2024-07-20',
        approvedBy: 'John Smith - VP Technology',
        approvedDate: '2024-07-25',
        comments: [
            {
                author: 'Jane Doe',
                date: '2024-07-20',
                text: 'Technical feasibility confirmed. Recommend hiring specialist mobile developer.'
            },
            {
                author: 'John Smith',
                date: '2024-07-25',
                text: 'Approved. Budget increase authorized. Please proceed with resource acquisition.'
            }
        ]
    },
    {
        id: 'cr-2',
        projectId: 'proj-1',
        sowId: 'sow-1',
        title: 'Timeline Extension for Security Audit',
        type: 'Timeline Extension',
        status: 'Under Review',
        description: 'Request 3-week extension to complete comprehensive security audit as required by new regulatory guidelines.',
        businessJustification: 'New PCI-DSS 4.0 requirements mandate additional security controls that were not in original scope.',
        impactAnalysis: {
            timeline: 'Extend final milestone by 3 weeks',
            budget: 0,
            resources: 'No additional resources required'
        },
        requestedBy: 'Mike Chen - Security Lead',
        requestedDate: '2024-11-15',
        comments: []
    }
];

// Initialize Risks
let risks: Risk[] = [
    {
        id: 'risk-1',
        projectId: 'proj-1',
        title: 'Third-party API Integration Delays',
        description: 'Payment gateway provider has announced potential delays in API v3 release which our architecture depends on.',
        category: 'Technical',
        severity: 'High',
        probability: 'Medium',
        status: 'Mitigating',
        impact: 'Could delay payment module delivery by 4-6 weeks, affecting Q1 2025 launch target.',
        mitigationPlan: 'Develop adapter layer to support both API v2 and v3. Allocate additional developer to create fallback implementation.',
        contingencyPlan: 'If API v3 is delayed beyond January 2025, proceed with v2 implementation and plan v3 migration for Q2.',
        owner: 'Jane Doe',
        identifiedDate: '2024-10-15',
        targetResolutionDate: '2024-12-31',
        lastUpdated: '2024-11-20'
    },
    {
        id: 'risk-2',
        projectId: 'proj-1',
        title: 'Key Resource Availability',
        description: 'Lead security architect has family medical situation and may need extended leave during critical security implementation phase.',
        category: 'Resource',
        severity: 'Critical',
        probability: 'High',
        status: 'Analyzing',
        impact: 'Security implementation could be delayed or quality compromised without experienced leadership.',
        mitigationPlan: 'Cross-train two senior developers on security architecture. Engage external security consultant as backup.',
        contingencyPlan: 'Hire contract security architect with banking domain experience if leave extends beyond 2 weeks.',
        owner: 'John Smith',
        identifiedDate: '2024-11-18',
        targetResolutionDate: '2024-12-01',
        lastUpdated: '2024-11-22'
    },
    {
        id: 'risk-3',
        projectId: 'proj-1',
        title: 'Regulatory Compliance Changes',
        description: 'New PCI-DSS 4.0 requirements may necessitate additional security controls not in original scope.',
        category: 'Compliance',
        severity: 'Medium',
        probability: 'Low',
        status: 'Monitoring',
        impact: 'May require additional security features, potentially adding $50K-$75K to budget and 2-3 weeks to timeline.',
        mitigationPlan: 'Monitor PCI-DSS 4.0 finalization. Conduct gap analysis once requirements are published.',
        owner: 'Mike Chen',
        identifiedDate: '2024-09-20',
        lastUpdated: '2024-11-15'
    }
];

// Initialize Dependencies
let dependencies: Dependency[] = [
    {
        id: 'dep-1',
        projectId: 'proj-1',
        title: 'Customer Data Migration from Legacy System',
        description: 'Requires completion of data migration from legacy mainframe system before user authentication can be tested.',
        type: 'Internal',
        status: 'In Progress',
        dependsOn: 'Legacy System Decommissioning Project',
        dependentParty: 'Data Migration Team',
        requiredDate: '2024-12-15',
        expectedDate: '2024-12-20',
        impact: 'Cannot complete UAT for authentication module without migrated customer data. Critical path item.',
        owner: 'Sarah Johnson',
        notes: 'Weekly sync meetings established. Migration is 60% complete as of Nov 20.',
        createdDate: '2024-08-01',
        lastUpdated: '2024-11-20'
    },
    {
        id: 'dep-2',
        projectId: 'proj-1',
        title: 'Infrastructure Provisioning',
        description: 'Production AWS environment setup including VPC, security groups, and RDS instances.',
        type: 'Technical',
        status: 'Blocked',
        dependsOn: 'AWS Enterprise Agreement Approval',
        dependentParty: 'IT Procurement & Cloud Ops Team',
        requiredDate: '2024-11-30',
        impact: 'Cannot deploy to production environment or conduct performance testing. Blocks go-live preparation.',
        owner: 'David Kim',
        notes: 'Procurement approval delayed due to budget review cycle. Escalated to VP level.',
        createdDate: '2024-09-15',
        lastUpdated: '2024-11-22'
    },
    {
        id: 'dep-3',
        projectId: 'proj-1',
        title: 'External Security Audit',
        description: 'Third-party security firm must complete penetration testing before production deployment.',
        type: 'External',
        status: 'Pending',
        dependsOn: 'Security Audit Contract Execution',
        dependentParty: 'CyberSec Solutions Inc.',
        requiredDate: '2025-01-15',
        expectedDate: '2025-01-10',
        impact: 'Regulatory requirement for production deployment. Cannot launch without completed audit report.',
        owner: 'Mike Chen',
        notes: 'Contract signed. Audit scheduled for first week of January 2025.',
        createdDate: '2024-10-01',
        lastUpdated: '2024-11-18'
    }
];

// Initialize Supporting Documents
let supportingDocuments: SupportingDocument[] = [
    {
        id: 'doc-1',
        projectId: 'proj-1',
        title: 'Statement of Work - Phase 1',
        description: 'Signed SOW for initial development phase including discovery, design, and core platform development.',
        type: 'Contract',
        status: 'Approved',
        fileName: 'SOW_Phase1_v2.1_Signed.pdf',
        fileSize: 2457600,
        fileUrl: '/documents/proj-1/SOW_Phase1_v2.1_Signed.pdf',
        uploadedBy: 'Jane Doe',
        uploadedDate: '2024-01-10',
        version: '2.1',
        tags: ['contract', 'sow', 'phase-1'],
        lastModified: '2024-01-10'
    },
    {
        id: 'doc-2',
        projectId: 'proj-1',
        title: 'Technical Architecture Document',
        description: 'Comprehensive system architecture including microservices design, data flow diagrams, and infrastructure specifications.',
        type: 'Design',
        status: 'Approved',
        fileName: 'Technical_Architecture_v3.0.pdf',
        fileSize: 5242880,
        fileUrl: '/documents/proj-1/Technical_Architecture_v3.0.pdf',
        uploadedBy: 'Sarah Johnson',
        uploadedDate: '2024-03-15',
        version: '3.0',
        tags: ['architecture', 'technical', 'design'],
        lastModified: '2024-04-22'
    },
    {
        id: 'doc-3',
        projectId: 'proj-1',
        title: 'Security Compliance Report Q3 2024',
        description: 'Quarterly security assessment and compliance status report covering PCI-DSS and SOC 2 requirements.',
        type: 'Report',
        status: 'Approved',
        fileName: 'Security_Compliance_Q3_2024.pdf',
        fileSize: 1048576,
        fileUrl: '/documents/proj-1/Security_Compliance_Q3_2024.pdf',
        uploadedBy: 'Mike Chen',
        uploadedDate: '2024-10-05',
        version: '1.0',
        tags: ['security', 'compliance', 'q3-2024'],
        lastModified: '2024-10-05'
    },
    {
        id: 'doc-4',
        projectId: 'proj-1',
        title: 'Sprint Planning Notes - November 2024',
        description: 'Meeting notes from November sprint planning including user story breakdown and velocity calculations.',
        type: 'Meeting Notes',
        status: 'Draft',
        fileName: 'Sprint_Planning_Nov_2024.docx',
        fileSize: 524288,
        fileUrl: '/documents/proj-1/Sprint_Planning_Nov_2024.docx',
        uploadedBy: 'Emily Rodriguez',
        uploadedDate: '2024-11-01',
        version: '1.0',
        tags: ['sprint-planning', 'agile', 'november'],
        lastModified: '2024-11-15'
    }
];


const MOCK_USER: User = {
    id: '1',
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    role: 'Senior Frontend Engineer',
    department: 'Engineering',
    tenure: '3 years 2 months',
    avatarUrl: 'https://i.pravatar.cc/150?u=jane',
    title: 'Senior Software Engineer',
    location: 'New York, NY',
    status: 'Active',
    isAdmin: true,
    skills: [
        { id: '1', name: 'React', category: 'Application Development', subcategory: 'Frontend Frameworks', proficiency: 5, verified: true, tags: ['1', '2'] },
        { id: '2', name: 'TypeScript', category: 'Application Development', subcategory: 'Languages', proficiency: 4, verified: true, tags: ['1'] },
        { id: '3', name: 'Node.js', category: 'Application Development', subcategory: 'Backend Frameworks', proficiency: 3, verified: false, tags: ['2'] },
        { id: '4', name: 'GraphQL', category: 'Application Development', subcategory: 'Backend Frameworks', proficiency: 3, verified: true },
        { id: '5', name: 'UI/UX Design', category: 'Domain Knowledge', subcategory: 'User Experience & Design', proficiency: 4, verified: false },
        { id: '6', name: 'AWS', category: 'Platform Engineering', subcategory: 'Cloud Providers', proficiency: 2, verified: true, tags: ['3'] },
    ],
};

// Additional mock users for roster
let users: User[] = [
    MOCK_USER,
    {
        id: '2',
        name: 'John Smith',
        email: 'john.smith@example.com',
        role: 'Backend Developer',
        department: 'Engineering',
        tenure: '2 years 6 months',
        avatarUrl: 'https://i.pravatar.cc/150?u=john',
        title: 'Senior Backend Developer',
        location: 'San Francisco, CA',
        status: 'Active',
        isAdmin: false,
        skills: [
            { id: '7', name: 'Java', category: 'Application Development', subcategory: 'Languages', proficiency: 5, verified: true },
            { id: '8', name: 'Spring Boot', category: 'Application Development', subcategory: 'Backend Frameworks', proficiency: 4, verified: true },
            { id: '9', name: 'PostgreSQL', category: 'Data Management', subcategory: 'Databases', proficiency: 4, verified: true },
        ],
    },
    {
        id: '3',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        role: 'Cloud Architect',
        department: 'Platform Engineering',
        tenure: '5 years 1 month',
        avatarUrl: 'https://i.pravatar.cc/150?u=sarah',
        title: 'Principal Cloud Architect',
        location: 'Austin, TX',
        status: 'Active',
        isAdmin: false,
        skills: [
            { id: '10', name: 'AWS', category: 'Platform Engineering', subcategory: 'Cloud Providers', proficiency: 5, verified: true },
            { id: '11', name: 'Kubernetes', category: 'Platform Engineering', subcategory: 'DevOps', proficiency: 5, verified: true },
            { id: '12', name: 'Terraform', category: 'Platform Engineering', subcategory: 'DevOps', proficiency: 4, verified: true },
        ],
    },
    {
        id: '4',
        name: 'Michael Chen',
        email: 'michael.chen@example.com',
        role: 'Data Engineer',
        department: 'Data & Analytics',
        tenure: '1 year 8 months',
        avatarUrl: 'https://i.pravatar.cc/150?u=michael',
        title: 'Data Engineer',
        location: 'Seattle, WA',
        status: 'Active',
        isAdmin: false,
        skills: [
            { id: '13', name: 'Python', category: 'Application Development', subcategory: 'Languages', proficiency: 4, verified: true },
            { id: '14', name: 'Apache Spark', category: 'Data Management', subcategory: 'Big Data', proficiency: 3, verified: true },
            { id: '15', name: 'SQL', category: 'Data Management', subcategory: 'Databases', proficiency: 4, verified: true },
        ],
    },
    {
        id: '5',
        name: 'Emily Rodriguez',
        email: 'emily.rodriguez@example.com',
        role: 'UX Designer',
        department: 'Design',
        tenure: '3 years 4 months',
        avatarUrl: 'https://i.pravatar.cc/150?u=emily',
        title: 'Senior UX Designer',
        location: 'Remote',
        status: 'Active',
        isAdmin: false,
        skills: [
            { id: '16', name: 'UI/UX Design', category: 'Domain Knowledge', subcategory: 'User Experience & Design', proficiency: 5, verified: true },
            { id: '17', name: 'Figma', category: 'Domain Knowledge', subcategory: 'User Experience & Design', proficiency: 5, verified: true },
            { id: '18', name: 'User Research', category: 'Domain Knowledge', subcategory: 'User Experience & Design', proficiency: 4, verified: true },
        ],
    },
    {
        id: '6',
        name: 'David Kim',
        email: 'david.kim@example.com',
        role: 'DevOps Engineer',
        department: 'Platform Engineering',
        tenure: '4 years 2 months',
        avatarUrl: 'https://i.pravatar.cc/150?u=david',
        title: 'Staff DevOps Engineer',
        location: 'Boston, MA',
        status: 'Inactive',
        isAdmin: false,
        skills: [
            { id: '19', name: 'Docker', category: 'Platform Engineering', subcategory: 'DevOps', proficiency: 5, verified: true },
            { id: '20', name: 'Jenkins', category: 'Platform Engineering', subcategory: 'DevOps', proficiency: 4, verified: true },
            { id: '21', name: 'Azure', category: 'Platform Engineering', subcategory: 'Cloud Providers', proficiency: 3, verified: true },
        ],
    },
];

// Initialize Groups
let groups: Group[] = [
    {
        id: 'group-1',
        name: 'Engineering',
        type: 'Department',
        ownerId: '1',
        description: 'Software Engineering Department'
    },
    {
        id: 'group-2',
        name: 'Platform Engineering',
        type: 'Department',
        ownerId: '3',
        description: 'Infrastructure and Platform Team'
    },
    {
        id: 'group-3',
        name: 'Data & Analytics',
        type: 'Department',
        ownerId: '4',
        description: 'Data Engineering and Analytics'
    },
    {
        id: 'group-4',
        name: 'Design',
        type: 'Department',
        ownerId: '5',
        description: 'UX/UI Design Team'
    },
    {
        id: 'group-5',
        name: 'Cloud Practice',
        type: 'Practice',
        ownerId: '3',
        description: 'Cloud architecture and migration specialists'
    },
    {
        id: 'group-6',
        name: 'Frontend Practice',
        type: 'Practice',
        ownerId: '1',
        parentGroupId: 'group-1',
        description: 'Frontend development specialists'
    },
    {
        id: 'group-7',
        name: 'Backend Practice',
        type: 'Practice',
        ownerId: '2',
        parentGroupId: 'group-1',
        description: 'Backend development specialists'
    },
];

// Initialize UserGroups (many-to-many relationship)
let userGroups: UserGroup[] = [
    { userId: '1', groupId: 'group-1', isPrimary: true },
    { userId: '1', groupId: 'group-6', isPrimary: false },
    { userId: '2', groupId: 'group-1', isPrimary: true },
    { userId: '2', groupId: 'group-7', isPrimary: false },
    { userId: '3', groupId: 'group-2', isPrimary: true },
    { userId: '3', groupId: 'group-5', isPrimary: false },
    { userId: '4', groupId: 'group-3', isPrimary: true },
    { userId: '5', groupId: 'group-4', isPrimary: true },
    { userId: '6', groupId: 'group-2', isPrimary: true },
    { userId: '6', groupId: 'group-5', isPrimary: false },
];

// Initialize Paybands (sensitive data)
let paybands: Payband[] = [
    { id: 'pb-1', code: 'L1', label: 'Associate Consultant', minSalary: 60000, maxSalary: 80000 },
    { id: 'pb-2', code: 'L2', label: 'Consultant', minSalary: 80000, maxSalary: 100000 },
    { id: 'pb-3', code: 'L3', label: 'Senior Consultant', minSalary: 100000, maxSalary: 130000 },
    { id: 'pb-4', code: 'L4', label: 'Principal Consultant', minSalary: 130000, maxSalary: 160000 },
    { id: 'pb-5', code: 'L5', label: 'Staff Consultant', minSalary: 160000, maxSalary: 200000 },
    { id: 'pb-6', code: 'DIR', label: 'Director', minSalary: 180000, maxSalary: 250000 },
];

// Initialize Rate Cards
let rateCards: RateCard[] = [
    { id: 'rc-1', name: '2024 Standard - Junior', hourlyRate: 100, currency: 'USD', effectiveDate: '2024-01-01' },
    { id: 'rc-2', name: '2024 Standard - Mid', hourlyRate: 150, currency: 'USD', effectiveDate: '2024-01-01' },
    { id: 'rc-3', name: '2024 Standard - Senior', hourlyRate: 200, currency: 'USD', effectiveDate: '2024-01-01' },
    { id: 'rc-4', name: '2024 Standard - Principal', hourlyRate: 250, currency: 'USD', effectiveDate: '2024-01-01' },
    { id: 'rc-5', name: '2024 Premium - Senior', hourlyRate: 225, currency: 'USD', effectiveDate: '2024-01-01' },
    { id: 'rc-6', name: '2024 UK Standard - Senior', hourlyRate: 180, currency: 'GBP', effectiveDate: '2024-01-01' },
];

// Initialize UserFinancials
let userFinancials: UserFinancials[] = [
    { userId: '1', paybandId: 'pb-3', rateCardId: 'rc-3', effectiveDate: '2024-01-01' },
    { userId: '2', paybandId: 'pb-3', rateCardId: 'rc-3', effectiveDate: '2024-01-01' },
    { userId: '3', paybandId: 'pb-4', rateCardId: 'rc-4', effectiveDate: '2024-01-01' },
    { userId: '4', paybandId: 'pb-2', rateCardId: 'rc-2', effectiveDate: '2024-01-01' },
    { userId: '5', paybandId: 'pb-3', rateCardId: 'rc-3', effectiveDate: '2024-01-01' },
    { userId: '6', paybandId: 'pb-5', rateCardId: 'rc-5', effectiveDate: '2024-01-01' },
];


export const mockService = {
    getUserProfile: async (email: string): Promise<User> => {
        // Simulate API delay
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ ...MOCK_USER, email });
            }, 800);
        });
    },

    addSkill: async (_email: string, skill: Omit<Skill, 'id' | 'verified'>): Promise<Skill> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newSkill: Skill = {
                    ...skill,
                    id: Math.random().toString(36).substr(2, 9),
                    verified: false,
                };
                console.log('Adding skill:', newSkill);
                resolve(newSkill);
            }, 500);
        });
    },

    getCategories: async (): Promise<TaxonomyCategory[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([...categories]);
            }, 300);
        });
    },

    addCategory: async (category: TaxonomyCategory): Promise<TaxonomyCategory> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                categories = [...categories, category];
                resolve(category);
            }, 300);
        });
    },

    updateCategory: async (updatedCategory: TaxonomyCategory): Promise<TaxonomyCategory> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                categories = categories.map(c => c.name === updatedCategory.name ? updatedCategory : c);
                resolve(updatedCategory);
            }, 300);
        });
    },

    deleteCategory: async (categoryName: string): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                categories = categories.filter(c => c.name !== categoryName);
                resolve();
            }, 300);
        });
    },

    getTags: async (): Promise<Tag[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([...tags]);
            }, 300);
        });
    },

    addTag: async (tag: Omit<Tag, 'id'>): Promise<Tag> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newTag = { ...tag, id: Math.random().toString(36).substr(2, 9) };
                tags = [...tags, newTag];
                resolve(newTag);
            }, 300);
        });
    },

    deleteTag: async (id: string): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                tags = tags.filter(t => t.id !== id);
                resolve();
            }, 300);
        });
    },

    // Project Management Methods

    // Project CRUD
    getProjects: async (): Promise<Project[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([...projects]);
            }, 300);
        });
    },

    getProject: async (id: string): Promise<Project> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const project = projects.find(p => p.id === id);
                if (project) {
                    resolve({ ...project });
                } else {
                    reject(new Error('Project not found'));
                }
            }, 300);
        });
    },

    createProject: async (project: Omit<Project, 'id'>): Promise<Project> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newProject: Project = {
                    ...project,
                    id: `proj-${Math.random().toString(36).substr(2, 9)}`
                };
                projects = [...projects, newProject];
                resolve(newProject);
            }, 300);
        });
    },

    updateProject: async (updatedProject: Project): Promise<Project> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                projects = projects.map(p => p.id === updatedProject.id ? updatedProject : p);
                resolve(updatedProject);
            }, 300);
        });
    },

    deleteProject: async (id: string): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                projects = projects.filter(p => p.id !== id);
                // Also delete associated roles and assignments
                projectRoles = projectRoles.filter(r => r.projectId !== id);
                projectAssignments = projectAssignments.filter(a => a.projectId !== id);
                resolve();
            }, 300);
        });
    },

    // Role Management
    getProjectRoles: async (projectId: string): Promise<ProjectRole[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(projectRoles.filter(r => r.projectId === projectId));
            }, 300);
        });
    },

    createProjectRole: async (role: Omit<ProjectRole, 'id'>): Promise<ProjectRole> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newRole: ProjectRole = {
                    ...role,
                    id: `role-${Math.random().toString(36).substr(2, 9)}`
                };
                projectRoles = [...projectRoles, newRole];
                resolve(newRole);
            }, 300);
        });
    },

    updateProjectRole: async (updatedRole: ProjectRole): Promise<ProjectRole> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                projectRoles = projectRoles.map(r => r.id === updatedRole.id ? updatedRole : r);
                resolve(updatedRole);
            }, 300);
        });
    },

    deleteProjectRole: async (id: string): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                projectRoles = projectRoles.filter(r => r.id !== id);
                // Also delete associated assignments
                projectAssignments = projectAssignments.filter(a => a.roleId !== id);
                resolve();
            }, 300);
        });
    },

    // Assignment Management
    getProjectAssignments: async (projectId: string): Promise<ProjectAssignment[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(projectAssignments.filter(a => a.projectId === projectId));
            }, 300);
        });
    },

    createAssignment: async (assignment: Omit<ProjectAssignment, 'id'>): Promise<ProjectAssignment> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newAssignment: ProjectAssignment = {
                    ...assignment,
                    id: `assign-${Math.random().toString(36).substr(2, 9)}`
                };
                projectAssignments = [...projectAssignments, newAssignment];
                resolve(newAssignment);
            }, 300);
        });
    },

    updateAssignment: async (updatedAssignment: ProjectAssignment): Promise<ProjectAssignment> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                projectAssignments = projectAssignments.map(a =>
                    a.id === updatedAssignment.id ? updatedAssignment : a
                );
                resolve(updatedAssignment);
            }, 300);
        });
    },

    deleteAssignment: async (id: string): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                projectAssignments = projectAssignments.filter(a => a.id !== id);
                resolve();
            }, 300);
        });
    },

    // Smart Staffing
    searchUsersForRole: async (roleId: string): Promise<SkillMatchResult[]> => {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                const role = projectRoles.find(r => r.id === roleId);
                if (!role) {
                    reject(new Error('Role not found'));
                    return;
                }

                // For now, we only have one mock user, but this algorithm would work with multiple
                const users = [MOCK_USER];
                const results: SkillMatchResult[] = [];

                for (const user of users) {
                    const matchedSkills: { skillName: string; required: ProficiencyLevel; actual: ProficiencyLevel }[] = [];
                    const missingSkills: SkillRequirement[] = [];

                    // Check each required skill
                    for (const requirement of role.requiredSkills) {
                        const userSkill = user.skills.find(s =>
                            s.name === requirement.skillName &&
                            s.category === requirement.category &&
                            s.subcategory === requirement.subcategory
                        );

                        if (userSkill) {
                            matchedSkills.push({
                                skillName: requirement.skillName,
                                required: requirement.minProficiency,
                                actual: userSkill.proficiency
                            });
                        } else {
                            missingSkills.push(requirement);
                        }
                    }

                    // Calculate match percentage
                    // Base score: percentage of required skills present
                    const baseScore = (matchedSkills.length / role.requiredSkills.length) * 100;

                    // Proficiency bonus: add points for exceeding requirements
                    let proficiencyBonus = 0;
                    for (const match of matchedSkills) {
                        if (match.actual >= match.required) {
                            proficiencyBonus += (match.actual - match.required) * 5;
                        } else {
                            // Penalty for not meeting proficiency
                            proficiencyBonus -= (match.required - match.actual) * 10;
                        }
                    }

                    const matchPercentage = Math.max(0, Math.min(100, baseScore + proficiencyBonus));

                    // Get utilization
                    const utilization = await mockService.getUserUtilization(user.id);

                    results.push({
                        user,
                        matchPercentage,
                        matchedSkills,
                        missingSkills,
                        utilization
                    });
                }

                // Sort by match percentage (highest first)
                results.sort((a, b) => b.matchPercentage - a.matchPercentage);

                resolve(results);
            }, 500);
        });
    },

    getUserUtilization: async (userId: string, _dateRange?: { start: Date; end: Date }): Promise<UserUtilization> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Get all active assignments for this user
                const userAssignments = projectAssignments.filter(a =>
                    a.userId === userId && a.status === 'Active'
                );

                let totalAllocation = 0;
                const assignments = userAssignments.map(assignment => {
                    const project = projects.find(p => p.id === assignment.projectId);
                    totalAllocation += assignment.allocationPercent;

                    return {
                        projectId: assignment.projectId,
                        projectName: project?.name || 'Unknown Project',
                        allocation: assignment.allocationPercent,
                        startDate: assignment.startDate,
                        endDate: assignment.endDate
                    };
                });

                resolve({
                    userId,
                    totalAllocation,
                    assignments
                });
            }, 300);
        });
    },

    // Resource Management Methods

    // User Management
    getAllUsers: async (): Promise<User[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([...users]);
            }, 300);
        });
    },

    getUserById: async (userId: string): Promise<User> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const user = users.find(u => u.id === userId);
                if (user) {
                    resolve({ ...user });
                } else {
                    reject(new Error('User not found'));
                }
            }, 300);
        });
    },

    updateUser: async (updatedUser: User): Promise<User> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                users = users.map(u => u.id === updatedUser.id ? updatedUser : u);
                resolve(updatedUser);
            }, 300);
        });
    },

    // Group Management
    getGroups: async (): Promise<Group[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([...groups]);
            }, 300);
        });
    },

    getGroup: async (groupId: string): Promise<Group> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const group = groups.find(g => g.id === groupId);
                if (group) {
                    resolve({ ...group });
                } else {
                    reject(new Error('Group not found'));
                }
            }, 300);
        });
    },

    createGroup: async (group: Omit<Group, 'id'>): Promise<Group> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newGroup: Group = {
                    ...group,
                    id: `group-${Math.random().toString(36).substr(2, 9)}`
                };
                groups = [...groups, newGroup];
                resolve(newGroup);
            }, 300);
        });
    },

    updateGroup: async (updatedGroup: Group): Promise<Group> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                groups = groups.map(g => g.id === updatedGroup.id ? updatedGroup : g);
                resolve(updatedGroup);
            }, 300);
        });
    },

    deleteGroup: async (groupId: string): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                groups = groups.filter(g => g.id !== groupId);
                // Also remove all user-group associations
                userGroups = userGroups.filter(ug => ug.groupId !== groupId);
                resolve();
            }, 300);
        });
    },

    // User-Group Management
    getUserGroups: async (userId: string): Promise<UserGroup[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(userGroups.filter(ug => ug.userId === userId));
            }, 300);
        });
    },

    getGroupMembers: async (groupId: string): Promise<string[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const memberIds = userGroups
                    .filter(ug => ug.groupId === groupId)
                    .map(ug => ug.userId);
                resolve(memberIds);
            }, 300);
        });
    },

    addUserToGroup: async (userId: string, groupId: string, isPrimary: boolean = false): Promise<UserGroup> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newUserGroup: UserGroup = { userId, groupId, isPrimary };
                userGroups = [...userGroups, newUserGroup];
                resolve(newUserGroup);
            }, 300);
        });
    },

    removeUserFromGroup: async (userId: string, groupId: string): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                userGroups = userGroups.filter(ug => !(ug.userId === userId && ug.groupId === groupId));
                resolve();
            }, 300);
        });
    },

    updateUserGroupPrimary: async (userId: string, groupId: string, isPrimary: boolean): Promise<UserGroup> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                userGroups = userGroups.map(ug =>
                    ug.userId === userId && ug.groupId === groupId
                        ? { ...ug, isPrimary }
                        : ug
                );
                const updated = userGroups.find(ug => ug.userId === userId && ug.groupId === groupId);
                resolve(updated!);
            }, 300);
        });
    },

    // Payband Management (Admin Only)
    getPaybands: async (): Promise<Payband[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([...paybands]);
            }, 300);
        });
    },

    // Rate Card Management (Admin Only)
    getRateCards: async (): Promise<RateCard[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([...rateCards]);
            }, 300);
        });
    },

    // User Financials Management (Admin Only)
    getUserFinancials: async (userId: string): Promise<UserFinancials | null> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const financials = userFinancials.find(uf => uf.userId === userId);
                resolve(financials ? { ...financials } : null);
            }, 300);
        });
    },

    updateUserFinancials: async (financials: UserFinancials): Promise<UserFinancials> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const existingIndex = userFinancials.findIndex(uf => uf.userId === financials.userId);
                if (existingIndex >= 0) {
                    userFinancials[existingIndex] = financials;
                } else {
                    userFinancials = [...userFinancials, financials];
                }
                resolve(financials);
            }, 300);
        });
    },

    // Contract Management Methods

    // SOW Management
    getProjectSOWs: async (projectId: string): Promise<SOW[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(sows.filter(s => s.projectId === projectId));
            }, 300);
        });
    },

    getSOW: async (id: string): Promise<SOW> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const sow = sows.find(s => s.id === id);
                if (sow) {
                    resolve({ ...sow });
                } else {
                    reject(new Error('SOW not found'));
                }
            }, 300);
        });
    },

    createSOW: async (sow: Omit<SOW, 'id'>): Promise<SOW> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newSOW: SOW = {
                    ...sow,
                    id: `sow-${Math.random().toString(36).substr(2, 9)}`
                };
                sows = [...sows, newSOW];
                resolve(newSOW);
            }, 300);
        });
    },

    updateSOW: async (updatedSOW: SOW): Promise<SOW> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                sows = sows.map(s => s.id === updatedSOW.id ? updatedSOW : s);
                resolve(updatedSOW);
            }, 300);
        });
    },

    deleteSOW: async (id: string): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                sows = sows.filter(s => s.id !== id);
                // Also delete associated change requests
                changeRequests = changeRequests.filter(cr => cr.sowId !== id);
                resolve();
            }, 300);
        });
    },

    // Change Request Management
    getSOWChangeRequests: async (sowId: string): Promise<ChangeRequest[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(changeRequests.filter(cr => cr.sowId === sowId));
            }, 300);
        });
    },

    getProjectChangeRequests: async (projectId: string): Promise<ChangeRequest[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(changeRequests.filter(cr => cr.projectId === projectId));
            }, 300);
        });
    },

    createChangeRequest: async (cr: Omit<ChangeRequest, 'id'>): Promise<ChangeRequest> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newCR: ChangeRequest = {
                    ...cr,
                    id: `cr-${Math.random().toString(36).substr(2, 9)}`
                };
                changeRequests = [...changeRequests, newCR];
                resolve(newCR);
            }, 300);
        });
    },

    updateChangeRequest: async (updatedCR: ChangeRequest): Promise<ChangeRequest> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                changeRequests = changeRequests.map(cr =>
                    cr.id === updatedCR.id ? updatedCR : cr
                );
                resolve(updatedCR);
            }, 300);
        });
    },

    deleteChangeRequest: async (id: string): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                changeRequests = changeRequests.filter(cr => cr.id !== id);
                resolve();
            }, 300);
        });
    },

    // Risk Management Methods
    getProjectRisks: async (projectId: string): Promise<Risk[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(risks.filter(r => r.projectId === projectId));
            }, 300);
        });
    },

    createRisk: async (risk: Omit<Risk, 'id'>): Promise<Risk> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newRisk: Risk = {
                    ...risk,
                    id: `risk-${Math.random().toString(36).substr(2, 9)}`
                };
                risks = [...risks, newRisk];
                resolve(newRisk);
            }, 300);
        });
    },

    updateRisk: async (updatedRisk: Risk): Promise<Risk> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                risks = risks.map(r =>
                    r.id === updatedRisk.id ? updatedRisk : r
                );
                resolve(updatedRisk);
            }, 300);
        });
    },

    deleteRisk: async (id: string): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                risks = risks.filter(r => r.id !== id);
                resolve();
            }, 300);
        });
    },

    // Dependency Management Methods
    getProjectDependencies: async (projectId: string): Promise<Dependency[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(dependencies.filter(d => d.projectId === projectId));
            }, 300);
        });
    },

    createDependency: async (dependency: Omit<Dependency, 'id'>): Promise<Dependency> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newDependency: Dependency = {
                    ...dependency,
                    id: `dep-${Math.random().toString(36).substr(2, 9)}`
                };
                dependencies = [...dependencies, newDependency];
                resolve(newDependency);
            }, 300);
        });
    },

    updateDependency: async (updatedDependency: Dependency): Promise<Dependency> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                dependencies = dependencies.map(d =>
                    d.id === updatedDependency.id ? updatedDependency : d
                );
                resolve(updatedDependency);
            }, 300);
        });
    },

    deleteDependency: async (id: string): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                dependencies = dependencies.filter(d => d.id !== id);
                resolve();
            }, 300);
        });
    },

    // Supporting Documents Methods
    getProjectDocuments: async (projectId: string): Promise<SupportingDocument[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(supportingDocuments.filter(doc => doc.projectId === projectId));
            }, 300);
        });
    },

    uploadDocument: async (document: Omit<SupportingDocument, 'id'>): Promise<SupportingDocument> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newDocument: SupportingDocument = {
                    ...document,
                    id: `doc-${Math.random().toString(36).substr(2, 9)}`
                };
                supportingDocuments = [...supportingDocuments, newDocument];
                resolve(newDocument);
            }, 300);
        });
    },

    updateDocument: async (updatedDocument: SupportingDocument): Promise<SupportingDocument> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                supportingDocuments = supportingDocuments.map(doc =>
                    doc.id === updatedDocument.id ? updatedDocument : doc
                );
                resolve(updatedDocument);
            }, 300);
        });
    },

    deleteDocument: async (id: string): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                supportingDocuments = supportingDocuments.filter(doc => doc.id !== id);
                resolve();
            }, 300);
        });
    }
};


