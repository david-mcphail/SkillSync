import type { TaxonomyCategory } from '../types/models';

export const TAXONOMY: TaxonomyCategory[] = [
    {
        name: 'Application Development',
        description: 'Focus: Languages, frameworks, and tools used to build software.',
        subcategories: [
            { name: 'Languages', skills: ['Java', 'C#', 'Python', 'TypeScript', 'Go', 'Rust'] },
            { name: 'Frontend Frameworks', skills: ['React', 'Angular', 'Vue.js', 'Svelte'] },
            { name: 'Backend Frameworks', skills: ['Node.js', 'Spring Boot', 'Django', '.NET Core'] },
            { name: 'Mobile', skills: ['Swift', 'Kotlin', 'React Native', 'Flutter'] },
        ],
    },
    {
        name: 'Consulting',
        description: 'Focus: Advisory services, strategic planning, and specialized implementation.',
        subcategories: [
            { name: 'Core Consulting - Communication', skills: ['Stakeholder Management', 'Workshop Facilitation', 'Presentation Skills', 'Storytelling'] },
            { name: 'Core Consulting - Problem Solving', skills: ['Critical Thinking', 'Root Cause Analysis', 'Hypothesis-Based Problem Solving'] },
            { name: 'Core Consulting - Commercial', skills: ['Proposal Writing', 'SOW Development', 'ROI Analysis'] },
            { name: 'Business Consulting - Strategy', skills: ['Digital Transformation', 'Organizational Change Management', 'Target Operating Model Design'] },
            { name: 'Business Consulting - Process', skills: ['Lean Six Sigma', 'Business Process Re-engineering', 'Value Stream Mapping'] },
            { name: 'Business Consulting - Analysis', skills: ['Market Research', 'Competitive Analysis', 'SWOT/PESTLE Analysis'] },
            { name: 'Technical Consulting - Advisory', skills: ['Technology Roadmap', 'IT Strategy', 'Vendor Selection', 'Technical Due Diligence'] },
            { name: 'Technical Consulting - Assessment', skills: ['Architecture Review', 'Security Audit', 'Code Quality Assessment', 'Legacy Modernization Strategy'] },
            { name: 'Technical Consulting - Implementation', skills: ['Cloud Migration Strategy', 'Build vs. Buy Analysis'] },
        ],
    },
    {
        name: 'Project and Client Delivery',
        description: 'Focus: Methodologies and management techniques for delivering work.',
        subcategories: [
            { name: 'Methodologies', skills: ['Agile', 'Scrum', 'Kanban', 'Waterfall', 'SAFe'] },
            { name: 'Management', skills: ['Risk Management', 'Stakeholder Management', 'Resource Planning'] },
            { name: 'Tools', skills: ['Jira', 'Asana', 'MS Project'] },
        ],
    },
    {
        name: 'Administration & Operations',
        description: 'Focus: Internal corporate functions.',
        subcategories: [
            { name: 'HR', skills: ['Talent Acquisition', 'Employee Relations', 'Compensation & Benefits', 'L&D'] },
            { name: 'Finance', skills: ['Forecasting', 'Budgeting', 'Payroll', 'Auditing', 'Tax Compliance'] },
            { name: 'Legal & Compliance', skills: ['Contract Law', 'GDPR', 'Data Privacy', 'Corporate Governance', 'IP Law'] },
        ],
    },
    {
        name: 'IT Service Management (ITSM)',
        description: 'Focus: Managing the delivery of IT services to customers.',
        subcategories: [
            { name: 'Frameworks', skills: ['ITIL v4', 'COBIT'] },
            { name: 'Operations', skills: ['Incident Management', 'Change Management', 'Service Desk Operations', 'Disaster Recovery'] },
        ],
    },
    {
        name: 'Platform Engineering',
        description: 'Focus: Infrastructure, Cloud, and DevOps.',
        subcategories: [
            { name: 'Cloud Providers', skills: ['AWS', 'Azure', 'Google Cloud Platform'] },
            { name: 'DevOps', skills: ['CI/CD Pipelines', 'Jenkins', 'GitLab', 'Docker', 'Kubernetes', 'Terraform'] },
            { name: 'Observability', skills: ['Prometheus', 'Grafana', 'Datadog', 'Splunk'] },
        ],
    },
    {
        name: 'Enterprise Platforms & Solutions',
        description: 'Focus: Implementation, development, and configuration within major SaaS/PaaS ecosystems.',
        subcategories: [
            { name: 'CRM & Customer Experience', skills: ['Salesforce', 'Microsoft Dynamics 365', 'HubSpot'] },
            { name: 'BPM & Low-Code', skills: ['Pega', 'Appian', 'Power Platform'] },
            { name: 'Service Management Platforms', skills: ['ServiceNow', 'BMC Helix'] },
            { name: 'ERP', skills: ['SAP', 'Oracle NetSuite'] },
        ],
    },
    {
        name: 'Leadership',
        description: 'Focus: Soft skills and management competencies.',
        subcategories: [
            { name: 'People Management', skills: ['Mentoring', 'Conflict Resolution', 'Performance Review'] },
            { name: 'Executive', skills: ['Strategic Planning', 'Vision Setting', 'Public Speaking', 'Crisis Management'] },
        ],
    },
    {
        name: 'Domain Knowledge',
        description: 'Focus: Subject Matter Expertise (SME) in specific industries or job functions.',
        subcategories: [
            { name: 'Financial Services', skills: ['Retail Banking', 'Investment Banking', 'Fintech', 'Fraud Detection'] },
            { name: 'Healthcare', skills: ['HIPAA Compliance', 'EMR/EHR Systems', 'Telemedicine', 'Clinical Trials'] },
            { name: 'Insurance', skills: ['Underwriting', 'Claims Processing', 'Actuarial Science', 'InsurTech'] },
            { name: 'Product & Analysis', skills: ['Product Owner', 'Product Manager', 'Business Analyst', 'Requirements Gathering', 'User Story Mapping'] },
            { name: 'User Experience & Design', skills: ['UI/UX Design', 'User Research', 'Wireframing', 'Interaction Design', 'Accessibility'] },
            { name: 'Architecture', skills: ['Enterprise Architecture', 'Solution Architecture', 'Microservices Design'] },
            { name: 'Quality Assurance', skills: ['Automation Testing', 'Performance Testing', 'Manual Testing', 'QA Strategy'] },
            { name: 'Delivery Management', skills: ['Scrum Master', 'Agile Coach', 'Project Manager', 'Release Manager', 'Delivery Lead'] },
            { name: 'Documentation & Training', skills: ['Technical Writing', 'Instructional Design', 'Knowledge Base Management', 'API Documentation'] },
            { name: 'Data', skills: ['Data Engineering', 'Data Science', 'Business Intelligence', 'SQL', 'NoSQL'] },
            { name: 'Security', skills: ['Cybersecurity', 'Penetration Testing', 'Identity & Access Management', 'InfoSec'] },
            { name: 'Support', skills: ['L1/L2/L3 Support', 'Customer Success', 'Technical Troubleshooting'] },
        ],
    },
];

export const SYNONYMS: Record<string, string> = {
    'K8s': 'Kubernetes',
    'Kube': 'Kubernetes',
    'JS': 'JavaScript', // Assuming JavaScript maps to something, though not explicitly in list, maybe TypeScript covers it or it should be added. Added for example.
    'TS': 'TypeScript',
    'Golang': 'Go',
    'Node': 'Node.js',
    'ReactJS': 'React',
    'Vue': 'Vue.js',
};

export const TAGS = [
    { id: '1', name: 'Certified', color: '#4caf50', description: 'Has a valid certification for this skill.' },
    { id: '2', name: 'Mentor', color: '#2196f3', description: 'Available to mentor others in this skill.' },
    { id: '3', name: 'Deprecated', color: '#f44336', description: 'This skill is no longer recommended for new projects.' },
];
