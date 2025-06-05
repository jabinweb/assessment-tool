import { PrismaClient } from '@prisma/client'

export async function seedCollegeCareers(prisma: PrismaClient) {
  
  const COLLEGE_CAREERS = [
    {
      title: "Data Scientist",
      description: "Analyze complex datasets to extract actionable insights, build predictive models, and drive data-informed business decisions across industries.",
      riasecProfile: { I: 90, C: 85, A: 50, E: 45, S: 40, R: 35 },
      requiredSkills: ["Statistical Analysis", "Python/R Programming", "Machine Learning", "Data Visualization", "Business Acumen"],
      educationLevel: "bachelor",
      salaryRange: { min: 75000, max: 150000, median: 110000 },
      growthOutlook: "excellent",
      workEnvironment: "office",
      personalityFit: { openness: 85, conscientiousness: 80, extraversion: 45, agreeableness: 60, neuroticism: 30 },
      industry: "Technology",
      workStyle: "independent",
      targetAudience: ["college_student"],
      entryPaths: {
        college: "Major in Data Science, Statistics, Computer Science, or Mathematics. Build portfolio projects.",
        graduate: "Consider MS in Data Science or Analytics for advanced positions."
      },
      schoolSubjects: ["Mathematics", "Statistics", "Computer Science"],
      collegePrograms: ["Data Science", "Statistics", "Computer Science", "Applied Mathematics", "Business Analytics"],
      internships: {
        opportunities: ["Tech companies", "Financial services", "Healthcare analytics", "Government agencies", "Consulting firms"],
        tips: "Focus on projects that demonstrate end-to-end data science pipeline skills"
      },
      skillDevelopment: {
        technical: ["Advanced SQL", "Cloud platforms (AWS/Azure)", "Deep learning frameworks", "A/B testing", "Data engineering"],
        soft: ["Business communication", "Stakeholder management", "Project leadership", "Cross-functional collaboration"]
      },
      realWorldExamples: {
        dayInLife: "Extract data from databases, perform statistical analysis, build ML models, create dashboards, present findings to executives",
        professionals: ["Research scientists at tech giants", "Analytics consultants", "Healthcare data analysts", "Financial risk modelers"]
      },
      careerProgression: {
        entry: "Junior Data Analyst / Data Scientist I",
        mid: "Senior Data Scientist / Analytics Manager",
        senior: "Principal Data Scientist / VP of Analytics"
      },
      alternativePaths: {
        related: ["Machine Learning Engineer", "Business Intelligence Analyst", "Quantitative Researcher", "Product Analyst"],
        entrepreneurial: "Start analytics consulting firm or data-driven SaaS company"
      }
    },

    {
      title: "Product Manager",
      description: "Lead cross-functional teams to develop products that meet market needs, balancing user requirements, technical constraints, and business objectives.",
      riasecProfile: { E: 85, S: 75, A: 60, I: 70, C: 65, R: 30 },
      requiredSkills: ["Strategic Thinking", "User Research", "Data Analysis", "Communication", "Project Management"],
      educationLevel: "bachelor",
      salaryRange: { min: 80000, max: 160000, median: 120000 },
      growthOutlook: "excellent",
      workEnvironment: "office",
      personalityFit: { extraversion: 80, openness: 85, conscientiousness: 75, agreeableness: 70, neuroticism: 35 },
      industry: "Technology",
      workStyle: "leadership",
      targetAudience: ["college_student"],
      entryPaths: {
        college: "Any major with strong analytical and communication skills. Gain experience through internships.",
        graduate: "MBA can be helpful but not required. Technical background valuable for tech products."
      },
      schoolSubjects: ["Business", "Psychology", "Communications", "Computer Science"],
      collegePrograms: ["Business Administration", "Engineering", "Computer Science", "Psychology", "Economics"],
      internships: {
        opportunities: ["Tech companies", "Startups", "Consulting firms", "Product management rotational programs"],
        tips: "Seek roles where you can influence product decisions and work with engineering teams"
      },
      skillDevelopment: {
        technical: ["Product analytics tools", "A/B testing", "UX/UI principles", "Agile methodologies", "SQL basics"],
        soft: ["Influence without authority", "Stakeholder management", "Negotiation", "Public speaking", "Strategic thinking"]
      },
      realWorldExamples: {
        dayInLife: "Analyze user data, define product requirements, coordinate with engineering and design teams, conduct user interviews, present to executives",
        professionals: ["SaaS product managers", "Mobile app PMs", "B2B product leaders", "E-commerce platform managers"]
      },
      careerProgression: {
        entry: "Associate Product Manager / Product Analyst",
        mid: "Senior Product Manager / Group PM",
        senior: "Director of Product / VP of Product"
      },
      alternativePaths: {
        related: ["Product Marketing Manager", "UX Researcher", "Business Analyst", "Strategy Consultant"],
        entrepreneurial: "Found a startup or become a fractional CPO"
      }
    },

    {
      title: "Software Engineer",
      description: "Design, develop, and maintain software systems and applications, working with cutting-edge technologies to solve complex technical challenges.",
      riasecProfile: { I: 85, A: 60, C: 80, E: 40, R: 45, S: 35 },
      requiredSkills: ["Programming Languages", "System Design", "Problem Solving", "Debugging", "Version Control"],
      educationLevel: "bachelor",
      salaryRange: { min: 70000, max: 180000, median: 120000 },
      growthOutlook: "excellent",
      workEnvironment: "office",
      personalityFit: { openness: 80, conscientiousness: 85, extraversion: 45, agreeableness: 60, neuroticism: 30 },
      industry: "Technology",
      workStyle: "team",
      targetAudience: ["college_student"],
      entryPaths: {
        college: "Computer Science, Software Engineering, or related technical degree. Build strong programming portfolio.",
        bootcamp: "Intensive coding bootcamps can provide alternative pathway with strong placement records."
      },
      schoolSubjects: ["Computer Science", "Mathematics", "Physics"],
      collegePrograms: ["Computer Science", "Software Engineering", "Computer Engineering", "Information Technology"],
      internships: {
        opportunities: ["FAANG companies", "Startups", "Financial services", "Government agencies", "Open source projects"],
        tips: "Contribute to open source projects and build personal projects to demonstrate skills"
      },
      skillDevelopment: {
        technical: ["Full-stack development", "Cloud architecture", "DevOps practices", "Security principles", "Performance optimization"],
        soft: ["Code review and mentoring", "Technical communication", "Agile collaboration", "Continuous learning"]
      },
      realWorldExamples: {
        dayInLife: "Write and review code, debug software issues, design system architecture, collaborate with product teams, participate in technical discussions",
        professionals: ["Frontend developers", "Backend engineers", "Full-stack developers", "Site reliability engineers"]
      },
      careerProgression: {
        entry: "Junior Developer / Software Engineer I",
        mid: "Senior Engineer / Tech Lead",
        senior: "Principal Engineer / Engineering Manager"
      },
      alternativePaths: {
        related: ["DevOps Engineer", "Data Engineer", "Cybersecurity Specialist", "Technical Product Manager"],
        entrepreneurial: "Found a tech startup or become a freelance consultant"
      }
    },

    {
      title: "Investment Banking Analyst",
      description: "Provide financial advisory services to corporations, governments, and institutions on mergers, acquisitions, capital raising, and strategic transactions.",
      riasecProfile: { E: 80, I: 85, C: 90, A: 40, S: 50, R: 25 },
      requiredSkills: ["Financial Modeling", "Valuation Analysis", "Excel Proficiency", "Presentation Skills", "Attention to Detail"],
      educationLevel: "bachelor",
      salaryRange: { min: 85000, max: 200000, median: 140000 },
      growthOutlook: "good",
      workEnvironment: "office",
      personalityFit: { conscientiousness: 95, extraversion: 75, openness: 65, agreeableness: 50, neuroticism: 40 },
      industry: "Finance",
      workStyle: "team",
      targetAudience: ["college_student"],
      entryPaths: {
        college: "Finance, Economics, or Business major from target schools. Strong GPA and internship experience crucial.",
        graduate: "MBA from top program can lead to Associate-level entry."
      },
      schoolSubjects: ["Mathematics", "Economics", "Business", "Accounting"],
      collegePrograms: ["Finance", "Economics", "Business Administration", "Mathematics", "Engineering"],
      internships: {
        opportunities: ["Bulge bracket banks", "Middle market firms", "Boutique investment banks", "Corporate development"],
        tips: "Network extensively and maintain high academic performance. CFA Level 1 can be advantageous."
      },
      skillDevelopment: {
        technical: ["Advanced Excel modeling", "PowerPoint presentations", "Bloomberg terminal", "Accounting principles", "Industry analysis"],
        soft: ["Client relationship management", "Time management under pressure", "Professional communication", "Team collaboration"]
      },
      realWorldExamples: {
        dayInLife: "Build financial models, prepare pitch presentations, conduct market research, support deal execution, work with senior bankers on client calls",
        professionals: ["M&A analysts", "Capital markets specialists", "Industry coverage bankers", "Private equity professionals"]
      },
      careerProgression: {
        entry: "Investment Banking Analyst",
        mid: "Associate / Vice President",
        senior: "Director / Managing Director"
      },
      alternativePaths: {
        related: ["Private Equity", "Hedge Funds", "Corporate Development", "Management Consulting"],
        exit: "Many transition to buy-side firms, corporate roles, or business school"
      }
    },

    {
      title: "UX Designer",
      description: "Research user needs and behaviors to design intuitive, accessible digital experiences that solve real problems and delight users.",
      riasecProfile: { A: 90, I: 70, S: 75, E: 60, C: 65, R: 35 },
      requiredSkills: ["User Research", "Prototyping", "Visual Design", "Interaction Design", "Usability Testing"],
      educationLevel: "bachelor",
      salaryRange: { min: 60000, max: 130000, median: 90000 },
      growthOutlook: "excellent",
      workEnvironment: "office",
      personalityFit: { openness: 90, agreeableness: 75, conscientiousness: 70, extraversion: 65, neuroticism: 35 },
      industry: "Technology",
      workStyle: "team",
      targetAudience: ["college_student"],
      entryPaths: {
        college: "Design, Psychology, HCI, or related field. Build strong portfolio demonstrating design process.",
        bootcamp: "UX design bootcamps provide intensive training with portfolio development."
      },
      schoolSubjects: ["Art", "Psychology", "Computer Science", "Communications"],
      collegePrograms: ["Graphic Design", "Human-Computer Interaction", "Psychology", "Industrial Design", "Digital Media"],
      internships: {
        opportunities: ["Tech companies", "Design agencies", "Startups", "In-house design teams", "Freelance projects"],
        tips: "Focus on building a portfolio that shows your design thinking process, not just final designs"
      },
      skillDevelopment: {
        technical: ["Figma/Sketch", "Adobe Creative Suite", "Prototyping tools", "Analytics platforms", "Basic HTML/CSS"],
        soft: ["Empathy and user advocacy", "Storytelling", "Collaboration with developers", "Presenting design rationale"]
      },
      realWorldExamples: {
        dayInLife: "Conduct user interviews, create wireframes and prototypes, collaborate with product and engineering teams, run usability tests, iterate on designs",
        professionals: ["Product designers", "UX researchers", "Service designers", "Design system leads"]
      },
      careerProgression: {
        entry: "Junior UX Designer / UX Designer",
        mid: "Senior UX Designer / Lead Designer",
        senior: "Principal Designer / Design Director"
      },
      alternativePaths: {
        related: ["Product Manager", "UX Researcher", "Service Designer", "Design Operations"],
        entrepreneurial: "Start design consultancy or design-focused product company"
      }
    }
  ]

  for (const careerData of COLLEGE_CAREERS) {
    await prisma.career.create({
      data: careerData
    })
  }

  console.log(`✅ Created ${COLLEGE_CAREERS.length} college-focused careers`)
}
