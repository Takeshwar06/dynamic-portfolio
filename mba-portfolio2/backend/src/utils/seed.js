require('dotenv').config();
const mongoose = require('mongoose');
const { Admin, Profile, Experience, Project, Skill, Certification, Blog, Leadership, ThemeSettings } = require('../models');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      Admin.deleteMany(),
      Profile.deleteMany(),
      Experience.deleteMany(),
      Project.deleteMany(),
      Skill.deleteMany(),
      Certification.deleteMany(),
      Blog.deleteMany(),
      Leadership.deleteMany(),
      ThemeSettings.deleteMany(),
    ]);
    console.log('🗑️  Cleared existing data');

    // Create admin
    await Admin.create({
      name: 'Admin',
      email: 'admin@portfolio.com',
      password: 'Admin@123',
    });
    console.log('👤 Admin created: admin@portfolio.com / Admin@123');

    // Create profile
    await Profile.create({
      name: 'Rajiv Mehta',
      tagline: 'MBA Candidate | Strategy & Operations | Consulting',
      bio: 'An ambitious MBA candidate with 4+ years of experience in strategy consulting and operations management. Passionate about leveraging data-driven insights to solve complex business challenges. Previously worked with Fortune 500 companies across FMCG, technology, and financial services sectors.',
      shortBio: 'Strategy-focused MBA candidate with consulting background.',
      email: 'rajiv.mehta@example.com',
      phone: '+91 9876543210',
      location: 'Mumbai, India',
      mbaProgram: 'MBA in Strategy & Finance',
      university: 'Indian Institute of Management, Ahmedabad',
      graduationYear: '2025',
      linkedin: 'https://linkedin.com/in/rajivmehta',
      github: 'https://github.com/rajivmehta',
      twitter: 'https://twitter.com/rajivmehta',
    });

    // Create experiences
    await Experience.insertMany([
      {
        title: 'Senior Strategy Analyst',
        company: 'McKinsey & Company',
        location: 'Mumbai, India',
        type: 'Full-time',
        startDate: new Date('2021-06-01'),
        endDate: new Date('2023-07-31'),
        isCurrent: false,
        description: 'Led cross-functional teams to deliver strategic transformation projects for top-tier clients in FMCG and financial services.',
        achievements: [
          'Drove a 20% revenue uplift for a leading FMCG client through go-to-market strategy redesign',
          'Managed a 5-member team to deliver a market entry study for a fintech startup',
          'Developed a cost optimization framework reducing operational costs by ₹12 Cr annually',
        ],
        metrics: [
          { label: 'Revenue Impact', value: '₹45 Cr+' },
          { label: 'Projects Led', value: '8' },
          { label: 'Client Satisfaction', value: '4.8/5' },
        ],
        skills: ['Strategy', 'Financial Modeling', 'Client Management', 'Data Analysis'],
        order: 0,
      },
      {
        title: 'Business Analyst',
        company: 'Deloitte Consulting',
        location: 'Bangalore, India',
        type: 'Full-time',
        startDate: new Date('2019-07-01'),
        endDate: new Date('2021-05-31'),
        isCurrent: false,
        description: 'Specialized in digital transformation and operational efficiency projects across manufacturing and retail sectors.',
        achievements: [
          'Implemented an ERP system reducing procurement cycle time by 35%',
          'Conducted market sizing analysis for a $500M product launch decision',
          'Built dashboards and analytics models adopted by 200+ stakeholders',
        ],
        metrics: [
          { label: 'Cost Savings', value: '$2M+' },
          { label: 'Cycle Time Reduction', value: '35%' },
        ],
        skills: ['Process Improvement', 'ERP', 'Excel', 'PowerBI', 'Stakeholder Management'],
        order: 1,
      },
    ]);

    // Create projects
    await Project.insertMany([
      {
        title: 'Market Entry Strategy: FinTech SaaS in Tier-2 Cities',
        slug: 'fintech-market-entry-tier2',
        tagline: 'Unlocking $200M addressable market through strategic geographic expansion',
        category: 'Strategy',
        industry: 'Financial Services',
        duration: '3 months',
        teamSize: '4',
        role: 'Project Lead',
        problem: 'A leading FinTech SaaS firm with strong Tier-1 presence sought to expand into Tier-2 and Tier-3 cities but lacked insight into local adoption barriers, competitive landscape, and distribution channel fit.',
        analysis: 'Conducted 60+ structured interviews with SME owners, kirana store operators, and local distributors. Analyzed competitor positioning, pricing elasticity, and digital penetration data. Built a customer segmentation model using primary and secondary data.',
        strategy: 'Recommended a phased "Crawl-Walk-Run" market entry: pilot in 5 cities with localized pricing, agent-led distribution, and vernacular onboarding. Proposed strategic partnerships with regional banks and NBFCs for co-marketing.',
        result: 'Strategy adopted by the CXO team. Pilot launched in Q1 2024. Early results show 40% higher retention vs. Tier-1 benchmarks and 60% lower CAC through agent-led model.',
        metrics: [
          { label: 'Addressable Market', value: '$200M' },
          { label: 'CAC Reduction', value: '60%' },
          { label: 'Retention Uplift', value: '40%' },
        ],
        tools: ['Excel', 'PowerBI', 'Miro'],
        frameworks: ['BCG Growth-Share Matrix', 'Porter\'s Five Forces', 'Customer Journey Mapping'],
        isFeatured: true,
        isVisible: true,
        tags: ['Fintech', 'Market Entry', 'Strategy', 'Go-to-Market'],
        order: 0,
      },
      {
        title: 'Supply Chain Resilience Post-COVID: FMCG Giant',
        slug: 'fmcg-supply-chain-resilience',
        tagline: 'Redesigning a ₹5000 Cr supply chain for 21st-century disruptions',
        category: 'Operations',
        industry: 'FMCG',
        duration: '4 months',
        teamSize: '6',
        role: 'Operations Lead',
        problem: 'Post-pandemic supply chain disruptions caused a ₹200 Cr revenue leakage for a top-3 FMCG company. Stockouts, supplier concentration risk, and demand forecasting errors were key pain points.',
        analysis: 'Root cause analysis across 12 product categories, 3 geographies. Supplier risk scoring model built on 30+ parameters. Demand volatility mapped against historical disruption events.',
        strategy: 'Implemented a dual-sourcing strategy for 80% of critical SKUs, digital demand sensing using ML-lite models, and a dynamic safety stock framework. Built a supplier resilience scorecard adopted company-wide.',
        result: 'Stockout rate reduced by 45%, demand forecast accuracy improved by 28%, and supply chain cost-to-serve reduced by 12% over 6 months post-implementation.',
        metrics: [
          { label: 'Stockout Reduction', value: '45%' },
          { label: 'Forecast Accuracy', value: '+28%' },
          { label: 'Cost Reduction', value: '12%' },
        ],
        tools: ['Python', 'Tableau', 'SAP', 'Excel'],
        frameworks: ['SCOR Model', 'Risk Matrix', 'Lean Six Sigma'],
        isFeatured: true,
        isVisible: true,
        tags: ['Supply Chain', 'FMCG', 'Operations', 'Risk Management'],
        order: 1,
      },
    ]);

    // Create skills
    await Skill.insertMany([
      {
        category: 'Strategic Skills',
        items: [
          { name: 'Business Strategy', level: 92 },
          { name: 'Market Research', level: 88 },
          { name: 'Financial Modeling', level: 85 },
          { name: 'Go-to-Market Strategy', level: 87 },
          { name: 'Competitive Analysis', level: 90 },
        ],
        order: 0,
      },
      {
        category: 'Analytical Tools',
        items: [
          { name: 'MS Excel (Advanced)', level: 95 },
          { name: 'PowerBI', level: 82 },
          { name: 'Tableau', level: 78 },
          { name: 'SQL', level: 72 },
          { name: 'Python (Basics)', level: 65 },
        ],
        order: 1,
      },
      {
        category: 'Soft Skills',
        items: [
          { name: 'Leadership', level: 90 },
          { name: 'Client Management', level: 93 },
          { name: 'Public Speaking', level: 85 },
          { name: 'Negotiation', level: 88 },
          { name: 'Team Collaboration', level: 95 },
        ],
        order: 2,
      },
      {
        category: 'Domain Knowledge',
        items: [
          { name: 'FMCG', level: 88 },
          { name: 'Financial Services', level: 82 },
          { name: 'EdTech', level: 75 },
          { name: 'Healthcare', level: 70 },
          { name: 'Supply Chain', level: 85 },
        ],
        order: 3,
      },
    ]);

    // Create certifications
    await Certification.insertMany([
      {
        name: 'CFA Level 1',
        issuer: 'CFA Institute',
        issueDate: new Date('2022-12-01'),
        description: 'Passed CFA Level 1 exam, demonstrating core competencies in investment tools and asset valuation.',
        order: 0,
      },
      {
        name: 'Google Data Analytics Certificate',
        issuer: 'Google / Coursera',
        issueDate: new Date('2023-03-15'),
        credentialUrl: 'https://coursera.org/certificate',
        description: 'Completed the professional data analytics certification covering SQL, R, and data visualization.',
        order: 1,
      },
      {
        name: 'Six Sigma Green Belt',
        issuer: 'KPMG',
        issueDate: new Date('2021-08-01'),
        description: 'Certified in Lean Six Sigma methodologies for process improvement and operational excellence.',
        order: 2,
      },
    ]);

    // Create leadership activities
    await Leadership.insertMany([
      {
        title: 'VP, Consulting Club',
        organization: 'IIM Ahmedabad',
        role: 'Vice President',
        startDate: new Date('2023-08-01'),
        isCurrent: true,
        description: 'Leading a 200-member consulting club, organizing case competitions, industry conclaves, and mentorship sessions with top consulting professionals.',
        achievements: [
          'Organized IIMA\'s largest case competition with 800+ participants from 50 B-schools',
          'Established a mentorship network with 40+ consultants from MBB firms',
          'Increased club membership by 60% in one academic year',
        ],
        order: 0,
      },
      {
        title: 'Core Committee Member',
        organization: 'IIMA Entrepreneurship Cell',
        role: 'Strategy Lead',
        startDate: new Date('2023-08-01'),
        isCurrent: true,
        description: 'Driving startup ecosystem initiatives, investor connect events, and pitch bootcamps for aspiring entrepreneurs.',
        order: 1,
      },
    ]);

    // Create blogs
    await Blog.insertMany([
      {
        title: 'The New Playbook for Market Entry in Emerging Economies',
        slug: 'market-entry-emerging-economies',
        excerpt: 'Traditional market entry frameworks fail in emerging markets. Here\'s what the data and field experience taught me about cracking Tier-2 and Tier-3 markets in India.',
        content: 'Full article content here...',
        category: 'Strategy',
        tags: ['Market Entry', 'Emerging Markets', 'Strategy', 'India'],
        readTime: 8,
        isPublished: true,
        isFeatured: true,
        publishedAt: new Date('2024-01-15'),
        views: 245,
      },
      {
        title: 'Why Supply Chain Resilience Is The New Competitive Moat',
        slug: 'supply-chain-competitive-moat',
        excerpt: 'Post-COVID, companies that built resilient supply chains outperformed peers by 22% on EBITDA margins. Here\'s the framework they used.',
        content: 'Full article content here...',
        category: 'Operations',
        tags: ['Supply Chain', 'Resilience', 'Operations', 'FMCG'],
        readTime: 6,
        isPublished: true,
        publishedAt: new Date('2024-02-10'),
        views: 178,
      },
    ]);

    // Create theme settings
    await ThemeSettings.create({
      activeTheme: 'light',
      activeLayout: 'modern',
      primaryColor: '#1a365d',
      accentColor: '#d69e2e',
    });

    console.log('✅ Seed data inserted successfully!');
    console.log('\n📝 Admin credentials:');
    console.log('   Email: admin@portfolio.com');
    console.log('   Password: Admin@123');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
};

seedData();
