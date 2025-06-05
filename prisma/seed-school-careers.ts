import { PrismaClient } from '@prisma/client'

export async function seedSchoolCareers(prisma: PrismaClient) {
  
  const SCHOOL_CAREERS = [
    {
      title: "Game Developer",
      description: "Create video games that people love to play! You'll design characters, write code, and bring virtual worlds to life.",
      riasecProfile: { A: 85, I: 75, C: 60, E: 45, R: 40, S: 30 },
      requiredSkills: ["Creativity", "Programming", "Problem Solving", "Teamwork", "Art/Design"],
      educationLevel: "bachelor",
      salaryRange: { min: 50000, max: 100000, median: 75000 },
      growthOutlook: "excellent",
      workEnvironment: "office",
      personalityFit: { openness: 85, conscientiousness: 70, extraversion: 50, agreeableness: 60, neuroticism: 35 },
      industry: "Technology",
      workStyle: "team",
      targetAudience: ["school_student"],
      entryPaths: {
        school: "Take computer science, art, and math classes. Join coding clubs or game development groups.",
        afterSchool: "Learn programming languages like Python or C#. Create simple games as projects."
      },
      schoolSubjects: ["Computer Science", "Mathematics", "Art", "Physics"],
      collegePrograms: ["Computer Science", "Game Design", "Digital Arts", "Software Engineering"],
      internships: {
        opportunities: ["Game studios internships", "Tech company programs", "Indie game development"],
        tips: "Build a portfolio of small games you've created"
      },
      skillDevelopment: {
        technical: ["Learn Unity or Unreal Engine", "Practice coding daily", "Study game design principles"],
        soft: ["Work on team projects", "Present your games to others", "Learn to take feedback"]
      },
      realWorldExamples: {
        dayInLife: "Design game levels, write code for character movement, test gameplay, collaborate with artists",
        professionals: ["Indie developers", "AAA studio programmers", "Mobile game creators"]
      },
      careerProgression: {
        entry: "Junior Game Developer",
        mid: "Senior Game Developer / Lead Programmer",
        senior: "Game Director / Studio Founder"
      },
      alternativePaths: {
        related: ["App Developer", "Web Developer", "Animation", "UX Designer"],
        entrepreneurial: "Start your own indie game studio"
      }
    },
    
    {
      title: "YouTuber/Content Creator",
      description: "Create videos, blogs, or social media content that entertains and educates people around the world.",
      riasecProfile: { A: 90, E: 80, S: 70, I: 50, C: 40, R: 30 },
      requiredSkills: ["Creativity", "Communication", "Video Editing", "Social Media", "Marketing"],
      educationLevel: "high_school",
      salaryRange: { min: 25000, max: 200000, median: 60000 },
      growthOutlook: "good",
      workEnvironment: "home/studio",
      personalityFit: { extraversion: 85, openness: 90, conscientiousness: 65, agreeableness: 70, neuroticism: 45 },
      industry: "Media",
      workStyle: "independent",
      targetAudience: ["school_student"],
      entryPaths: {
        school: "Practice making videos with your phone. Take media, art, or communication classes.",
        afterSchool: "Start a channel on topics you love. Learn video editing software."
      },
      schoolSubjects: ["Media Studies", "Art", "English", "Business", "Drama"],
      collegePrograms: ["Digital Media", "Communications", "Marketing", "Film Production"],
      internships: {
        opportunities: ["Media companies", "Marketing agencies", "Local TV stations"],
        tips: "Build your own following first to show your skills"
      },
      skillDevelopment: {
        technical: ["Video editing (Premiere, Final Cut)", "Photography", "Basic graphic design", "SEO"],
        soft: ["Public speaking", "Consistency", "Audience engagement", "Business skills"]
      },
      realWorldExamples: {
        dayInLife: "Plan content, film videos, edit footage, respond to comments, collaborate with brands",
        professionals: ["Educational YouTubers", "Gaming streamers", "Lifestyle bloggers", "Tech reviewers"]
      },
      careerProgression: {
        entry: "Small channel (1K-10K subscribers)",
        mid: "Established creator (100K+ subscribers)",
        senior: "Media company owner / Multi-channel network"
      },
      alternativePaths: {
        related: ["Social Media Manager", "Video Editor", "Marketing Specialist", "Photographer"],
        entrepreneurial: "Start a media production company"
      }
    },

    {
      title: "Veterinarian",
      description: "Help sick and injured animals get better. You'll be like a doctor, but for pets and other animals!",
      riasecProfile: { S: 85, I: 80, R: 60, C: 70, A: 40, E: 50 },
      requiredSkills: ["Love for animals", "Science knowledge", "Gentle hands", "Problem solving", "Patience"],
      educationLevel: "phd",
      salaryRange: { min: 70000, max: 150000, median: 95000 },
      growthOutlook: "excellent",
      workEnvironment: "animal clinic",
      personalityFit: { agreeableness: 85, conscientiousness: 90, openness: 70, extraversion: 60, neuroticism: 30 },
      industry: "Healthcare",
      workStyle: "independent",
      targetAudience: ["school_student"],
      entryPaths: {
        school: "Excel in biology, chemistry, and math. Volunteer at animal shelters or vet clinics.",
        afterSchool: "Get experience with animals. Shadow a veterinarian."
      },
      schoolSubjects: ["Biology", "Chemistry", "Mathematics", "Physics", "Animal Science"],
      collegePrograms: ["Pre-Veterinary", "Animal Science", "Biology", "Veterinary Medicine"],
      internships: {
        opportunities: ["Veterinary clinics", "Animal hospitals", "Zoos", "Research labs"],
        tips: "Start volunteering early to gain animal handling experience"
      },
      skillDevelopment: {
        technical: ["Animal anatomy", "Medical procedures", "Laboratory skills", "Surgery"],
        soft: ["Compassion", "Communication with pet owners", "Handling stress", "Attention to detail"]
      },
      realWorldExamples: {
        dayInLife: "Examine pets, give vaccinations, perform surgeries, talk to worried pet owners",
        professionals: ["Small animal vets", "Large animal vets", "Zoo veterinarians", "Research vets"]
      },
      careerProgression: {
        entry: "Veterinary Assistant / Vet School Student",
        mid: "Licensed Veterinarian",
        senior: "Veterinary Specialist / Clinic Owner"
      },
      alternativePaths: {
        related: ["Veterinary Technician", "Animal Trainer", "Wildlife Biologist", "Pet Groomer"],
        specialization: "Specialize in exotic animals, surgery, or animal behavior"
      }
    },

    {
      title: "Chef",
      description: "Create delicious meals and run restaurant kitchens. Turn your love of cooking into an exciting career!",
      riasecProfile: { A: 80, R: 70, E: 65, S: 50, I: 40, C: 55 },
      requiredSkills: ["Cooking", "Creativity", "Time management", "Leadership", "Taste and smell"],
      educationLevel: "high_school",
      salaryRange: { min: 30000, max: 80000, median: 50000 },
      growthOutlook: "good",
      workEnvironment: "kitchen",
      personalityFit: { openness: 75, conscientiousness: 80, extraversion: 60, agreeableness: 65, neuroticism: 40 },
      industry: "Hospitality",
      workStyle: "team",
      targetAudience: ["school_student"],
      entryPaths: {
        school: "Take culinary arts classes. Practice cooking at home. Work part-time in restaurants.",
        afterSchool: "Get a job as a prep cook or server to learn the industry."
      },
      schoolSubjects: ["Culinary Arts", "Business", "Chemistry", "Math", "Health Sciences"],
      collegePrograms: ["Culinary Arts", "Hospitality Management", "Food Science", "Restaurant Management"],
      internships: {
        opportunities: ["Restaurant kitchens", "Hotels", "Catering companies", "Food trucks"],
        tips: "Start with any kitchen job to learn the basics"
      },
      skillDevelopment: {
        technical: ["Knife skills", "Cooking techniques", "Food safety", "Menu planning", "Cost control"],
        soft: ["Working under pressure", "Team leadership", "Customer service", "Creativity"]
      },
      realWorldExamples: {
        dayInLife: "Plan menus, prepare ingredients, cook meals during busy dinner rush, manage kitchen staff",
        professionals: ["Restaurant chefs", "Personal chefs", "Food truck owners", "TV cooking show hosts"]
      },
      careerProgression: {
        entry: "Prep Cook / Line Cook",
        mid: "Sous Chef / Head Chef",
        senior: "Executive Chef / Restaurant Owner"
      },
      alternativePaths: {
        related: ["Food Blogger", "Restaurant Manager", "Food Photographer", "Nutritionist"],
        entrepreneurial: "Open your own restaurant or food truck"
      }
    },

    {
      title: "Teacher",
      description: "Help kids learn and grow! Share your knowledge and make a difference in young people's lives every day.",
      riasecProfile: { S: 90, E: 70, A: 60, I: 50, C: 65, R: 25 },
      requiredSkills: ["Patience", "Communication", "Subject knowledge", "Creativity", "Leadership"],
      educationLevel: "bachelor",
      salaryRange: { min: 40000, max: 70000, median: 55000 },
      growthOutlook: "good",
      workEnvironment: "classroom",
      personalityFit: { agreeableness: 85, extraversion: 75, conscientiousness: 80, openness: 70, neuroticism: 30 },
      industry: "Education",
      workStyle: "independent",
      targetAudience: ["school_student"],
      entryPaths: {
        school: "Excel in the subject you want to teach. Volunteer to tutor classmates or younger students.",
        afterSchool: "Work as a camp counselor or after-school program helper."
      },
      schoolSubjects: ["Your teaching subject", "Psychology", "English", "Public Speaking", "Child Development"],
      collegePrograms: ["Education", "Teaching", "Subject-specific major + Education minor"],
      internships: {
        opportunities: ["Student teaching", "Tutoring centers", "Summer camps", "After-school programs"],
        tips: "Get experience working with kids of different ages"
      },
      skillDevelopment: {
        technical: ["Lesson planning", "Classroom management", "Educational technology", "Assessment methods"],
        soft: ["Public speaking", "Patience", "Motivating others", "Problem-solving", "Empathy"]
      },
      realWorldExamples: {
        dayInLife: "Plan lessons, teach classes, grade assignments, meet with parents, help struggling students",
        professionals: ["Elementary teachers", "High school teachers", "Special education teachers", "Principals"]
      },
      careerProgression: {
        entry: "Student Teacher / Substitute Teacher",
        mid: "Licensed Teacher / Department Head",
        senior: "Principal / Curriculum Director"
      },
      alternativePaths: {
        related: ["School Counselor", "Educational Technology", "Textbook Writer", "Corporate Trainer"],
        specialization: "Special education, ESL, or gifted education"
      }
    }
  ]

  for (const careerData of SCHOOL_CAREERS) {
    await prisma.career.create({
      data: careerData
    })
  }

  console.log(`✅ Created ${SCHOOL_CAREERS.length} school-focused careers`)
}
