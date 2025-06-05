interface Answer {
  questionId: string;
  answer: string;
  timeSpent?: number;
}

interface Question {
  id: string;
  section: string;
  subDomain?: string | null;
  type: string;
  correctAnswer?: number;
  isReversed?: boolean;
  trait?: string | null;
  riasecCode?: string | null;
  difficulty?: string | null;
  options: any;
  assessmentType?: {
    targetAudience?: string;
  };
}

export class AssessmentScoring {
  
  static calculateAptitudeScores(answers: Answer[], questions: Question[]) {
    // Get assessment type from questions to determine scoring approach
    const assessmentType = questions[0]?.assessmentType?.targetAudience;
    
    if (assessmentType === 'school_student') {
      return this.calculateSchoolAptitudeScores(answers, questions);
    } else if (assessmentType === 'college_student') {
      return this.calculateCollegeAptitudeScores(answers, questions);
    } else {
      return this.calculateProfessionalAptitudeScores(answers, questions);
    }
  }

  private static calculateSchoolAptitudeScores(answers: Answer[], questions: Question[]) {
    const subDomains = ['logical', 'numerical', 'verbal', 'spatial'];
    const scores: Record<string, any> = {};
    
    subDomains.forEach(domain => {
      const domainQuestions = questions.filter(q => q.subDomain === domain);
      const domainAnswers = answers.filter(a => 
        domainQuestions.some(q => q.id === a.questionId)
      );
      
      let correctCount = 0;
      let totalTime = 0;
      
      domainAnswers.forEach(answer => {
        const question = domainQuestions.find(q => q.id === answer.questionId);
        if (question) {
          const options = question.options as any;
          const correctAnswer = options.correctAnswer || 0;
          
          if (parseInt(answer.answer) === correctAnswer) {
            correctCount++;
          }
        }
        totalTime += answer.timeSpent || 0;
      });
      
      const rawScore = domainQuestions.length > 0 ? (correctCount / domainQuestions.length) * 100 : 0;
      const timeBonus = this.calculateTimeBonus(totalTime, domainQuestions.length);
      
      // School-friendly scoring with encouragement
      const adjustedScore = Math.min(100, rawScore + timeBonus);
      const level = this.getSchoolPerformanceLevel(adjustedScore);
      
      scores[domain] = {
        raw: rawScore,
        adjusted: adjustedScore,
        correct: correctCount,
        total: domainQuestions.length,
        timeSpent: totalTime,
        level: level,
        encouragement: this.getSchoolEncouragement(level, domain)
      };
    });
    
    const validScores = Object.values(scores).filter((score: any) => score.total > 0);
    const overall = validScores.length > 0 
      ? validScores.reduce((sum: number, score: any) => sum + score.adjusted, 0) / validScores.length
      : 0;
    
    scores.overall = {
      score: Math.round(overall),
      level: this.getSchoolPerformanceLevel(overall),
      message: this.getOverallSchoolMessage(overall)
    };
    
    return scores;
  }

  private static calculateCollegeAptitudeScores(answers: Answer[], questions: Question[]) {
    // More detailed scoring for college students
    const subDomains = ['logical', 'numerical', 'verbal', 'spatial', 'analytical'];
    const scores: Record<string, any> = {};
    
    subDomains.forEach(domain => {
      const domainQuestions = questions.filter(q => q.subDomain === domain);
      const domainAnswers = answers.filter(a => 
        domainQuestions.some(q => q.id === a.questionId)
      );
      
      if (domainQuestions.length === 0) return;
      
      let correctCount = 0;
      let totalTime = 0;
      let difficultyWeightedScore = 0;
      let totalDifficultyWeight = 0;
      
      domainAnswers.forEach(answer => {
        const question = domainQuestions.find(q => q.id === answer.questionId);
        if (question) {
          const options = question.options as any;
          const correctAnswer = options.correctAnswer || 0;
          const difficultyWeight = this.getDifficultyWeight(question.difficulty || null);
          
          if (parseInt(answer.answer) === correctAnswer) {
            correctCount++;
            difficultyWeightedScore += difficultyWeight;
          }
          totalDifficultyWeight += difficultyWeight;
        }
        totalTime += answer.timeSpent || 0;
      });
      
      const rawScore = (correctCount / domainQuestions.length) * 100;
      const weightedScore = (difficultyWeightedScore / totalDifficultyWeight) * 100;
      const timeBonus = this.calculateTimeBonus(totalTime, domainQuestions.length);
      
      scores[domain] = {
        raw: rawScore,
        weighted: weightedScore,
        adjusted: Math.min(100, weightedScore + timeBonus),
        correct: correctCount,
        total: domainQuestions.length,
        timeSpent: totalTime,
        percentile: this.calculatePercentile(weightedScore, domain),
        strengthLevel: this.getCollegeStrengthLevel(weightedScore)
      };
    });
    
    const validScores = Object.values(scores).filter((score: any) => score.total > 0);
    const overall = validScores.length > 0 
      ? validScores.reduce((sum: number, score: any) => sum + score.adjusted, 0) / validScores.length
      : 0;
    
    scores.overall = {
      score: Math.round(overall),
      percentile: this.calculatePercentile(overall, 'overall'),
      strengthProfile: this.generateStrengthProfile(scores)
    };
    
    return scores;
  }

  private static calculateProfessionalAptitudeScores(answers: Answer[], questions: Question[]) {
    // Advanced scoring for working professionals
    const subDomains = ['logical', 'numerical', 'verbal', 'spatial', 'analytical', 'strategic'];
    const scores: Record<string, any> = {};
    
    subDomains.forEach(domain => {
      const domainQuestions = questions.filter(q => q.subDomain === domain);
      const domainAnswers = answers.filter(a => 
        domainQuestions.some(q => q.id === a.questionId)
      );
      
      if (domainQuestions.length === 0) return;
      
      let correctCount = 0;
      let totalTime = 0;
      let complexityWeightedScore = 0;
      let totalComplexityWeight = 0;
      
      domainAnswers.forEach(answer => {
        const question = domainQuestions.find(q => q.id === answer.questionId);
        if (question) {
          const options = question.options as any;
          const correctAnswer = options.correctAnswer || 0;
          const complexityWeight = this.getComplexityWeight(question.difficulty || 'medium');
          
          if (parseInt(answer.answer) === correctAnswer) {
            correctCount++;
            complexityWeightedScore += complexityWeight;
          }
          totalComplexityWeight += complexityWeight;
        }
        totalTime += answer.timeSpent || 0;
      });
      
      const rawScore = (correctCount / domainQuestions.length) * 100;
      const weightedScore = totalComplexityWeight > 0 ? (complexityWeightedScore / totalComplexityWeight) * 100 : rawScore;
      const efficiencyBonus = this.calculateEfficiencyBonus(totalTime, domainQuestions.length);
      
      scores[domain] = {
        raw: rawScore,
        weighted: weightedScore,
        adjusted: Math.min(100, weightedScore + efficiencyBonus),
        correct: correctCount,
        total: domainQuestions.length,
        timeSpent: totalTime,
        percentile: this.calculatePercentile(weightedScore, domain),
        competencyLevel: this.getProfessionalCompetencyLevel(weightedScore),
        benchmarkComparison: this.getBenchmarkComparison(weightedScore, domain)
      };
    });
    
    const validScores = Object.values(scores).filter((score: any) => score.total > 0);
    const overall = validScores.length > 0 
      ? validScores.reduce((sum: number, score: any) => sum + score.adjusted, 0) / validScores.length
      : 0;
    
    scores.overall = {
      score: Math.round(overall),
      percentile: this.calculatePercentile(overall, 'overall'),
      competencyProfile: this.generateProfessionalProfile(scores),
      leadershipReadiness: this.assessLeadershipReadiness(scores)
    };
    
    return scores;
  }

  // Helper methods for school-specific scoring
  private static getSchoolPerformanceLevel(score: number): string {
    if (score >= 80) return 'Amazing! 🌟';
    if (score >= 60) return 'Great Job! 👍';
    if (score >= 40) return 'Good Work! 😊';
    return 'Keep Practicing! 💪';
  }

  private static getSchoolEncouragement(level: string, domain: string): string {
    const encouragements = {
      'Amazing! 🌟': `You're a ${domain} superstar! Keep using this strength!`,
      'Great Job! 👍': `You're really good at ${domain} thinking! Practice more to become even better!`,
      'Good Work! 😊': `You're on the right track with ${domain}! Keep working on it!`,
      'Keep Practicing! 💪': `${domain} can be tricky, but you can improve with practice!`
    };
    return encouragements[level as keyof typeof encouragements] || 'Keep learning and growing!';
  }

  private static getOverallSchoolMessage(score: number): string {
    if (score >= 80) return "Wow! You're really smart and did an amazing job! 🎉";
    if (score >= 60) return "Great job! You have some awesome thinking skills! 🌟";
    if (score >= 40) return "Good work! You're learning and growing! Keep it up! 📚";
    return "You're on a learning journey! Every practice makes you smarter! 🚀";
  }

  private static getDifficultyWeight(difficulty: string | null): number {
    const weights = {
      'easy': 1,
      'medium': 1.5,
      'hard': 2
    };
    return weights[difficulty as keyof typeof weights] || 1;
  }

  private static calculatePercentile(score: number, domain: string): number {
    // Simplified percentile calculation
    // In production, this would use actual population data
    if (score >= 90) return 95;
    if (score >= 80) return 85;
    if (score >= 70) return 70;
    if (score >= 60) return 55;
    if (score >= 50) return 40;
    return 25;
  }

  private static getCollegeStrengthLevel(score: number): string {
    if (score >= 85) return 'Exceptional';
    if (score >= 70) return 'Strong';
    if (score >= 55) return 'Developing';
    return 'Foundational';
  }

  private static generateStrengthProfile(scores: any): any {
    const domains = Object.keys(scores).filter(key => key !== 'overall');
    const sortedDomains = domains
      .map(domain => ({ domain, score: scores[domain].adjusted }))
      .sort((a, b) => b.score - a.score);
    
    return {
      strongest: sortedDomains.slice(0, 2),
      developing: sortedDomains.slice(-2),
      balanced: sortedDomains.every(d => d.score >= 60 && d.score <= 80)
    };
  }
  
  static calculatePersonalityScores(answers: Answer[], questions: Question[]) {
    const traits = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'];
    const scores: Record<string, number> = {};
    
    traits.forEach(trait => {
      const traitQuestions = questions.filter(q => q.trait === trait);
      const traitAnswers = answers.filter(a => 
        traitQuestions.some(q => q.id === a.questionId)
      );
      
      let totalScore = 0;
      traitAnswers.forEach(answer => {
        const question = traitQuestions.find(q => q.id === answer.questionId);
        let score = parseInt(answer.answer) + 1; // Convert 0-4 to 1-5
        
        // Check if this is a reversed item (stored in seed data)
        const questionData = question?.options as any;
        if (questionData?.isReversed) {
          score = 6 - score;
        }
        
        totalScore += score;
      });
      
      // Convert to 0-100 scale
      const maxPossible = traitQuestions.length * 5;
      scores[trait] = maxPossible > 0 ? Math.round((totalScore / maxPossible) * 100) : 0;
    });
    
    return scores;
  }
  
  static calculateInterestScores(answers: Answer[], questions: Question[]) {
    const riasecCodes = ['R', 'I', 'A', 'S', 'E', 'C'];
    const riasecNames = {
      'R': 'realistic',
      'I': 'investigative', 
      'A': 'artistic',
      'S': 'social',
      'E': 'enterprising',
      'C': 'conventional'
    };
    
    const scores: Record<string, number> = {};
    
    riasecCodes.forEach(code => {
      const codeQuestions = questions.filter(q => q.riasecCode === code);
      const codeAnswers = answers.filter(a => 
        codeQuestions.some(q => q.id === a.questionId)
      );
      
      let totalScore = 0;
      codeAnswers.forEach(answer => {
        totalScore += parseInt(answer.answer) + 1; // Convert 0-4 to 1-5
      });
      
      // Convert to 0-100 scale
      const maxPossible = codeQuestions.length * 5;
      const normalizedScore = maxPossible > 0 ? Math.round((totalScore / maxPossible) * 100) : 0;
      
      scores[riasecNames[code as keyof typeof riasecNames]] = normalizedScore;
    });
    
    return scores;
  }
  
  static calculateCareerMatches(
    aptitudeScores: any, 
    personalityScores: any, 
    interestScores: any,
    careers: any[]
  ) {
    return careers.map(career => {
      let matchScore = 0;
      let factors = 0;
      
      // Interest match (40% weight)
      if (career.riasecProfile) {
        let interestMatch = 0;
        let interestFactors = 0;
        
        Object.entries(career.riasecProfile).forEach(([code, required]: [string, any]) => {
          const codeName = this.riasecCodeToName(code);
          if (interestScores[codeName] !== undefined) {
            const difference = Math.abs(interestScores[codeName] - required);
            const similarity = Math.max(0, 100 - difference);
            interestMatch += similarity * (required / 100); // Weight by importance
            interestFactors += (required / 100);
          }
        });
        
        if (interestFactors > 0) {
          matchScore += (interestMatch / interestFactors) * 0.4;
          factors += 0.4;
        }
      }
      
      // Personality match (35% weight)
      if (career.personalityFit) {
        let personalityMatch = 0;
        let personalityFactors = 0;
        
        Object.entries(career.personalityFit).forEach(([trait, required]: [string, any]) => {
          if (personalityScores[trait] !== undefined) {
            const difference = Math.abs(personalityScores[trait] - required);
            const similarity = Math.max(0, 100 - difference);
            personalityMatch += similarity;
            personalityFactors++;
          }
        });
        
        if (personalityFactors > 0) {
          matchScore += (personalityMatch / personalityFactors) * 0.35;
          factors += 0.35;
        }
      }
      
      // Aptitude match (25% weight) - use overall aptitude score
      if (aptitudeScores.overall) {
        const aptitudeWeight = aptitudeScores.overall / 100;
        matchScore += aptitudeWeight * 0.25;
        factors += 0.25;
      }
      
      const finalScore = factors > 0 ? Math.round((matchScore / factors) * 100) : 0;
      
      return {
        ...career,
        matchPercentage: finalScore,
        matchFactors: {
          interest: this.calculateInterestMatch(interestScores, career.riasecProfile),
          personality: this.calculatePersonalityMatch(personalityScores, career.personalityFit),
          aptitude: aptitudeScores.overall || 0
        }
      };
    }).sort((a, b) => b.matchPercentage - a.matchPercentage);
  }
  
  private static calculateTimeBonus(timeSpent: number, questionCount: number): number {
    if (questionCount === 0) return 0;
    
    const averageTimePerQuestion = timeSpent / questionCount;
    const targetTime = 60; // 60 seconds per question
    
    if (averageTimePerQuestion <= targetTime) {
      return Math.min(10, (targetTime - averageTimePerQuestion) / targetTime * 10);
    }
    return 0;
  }
  
  private static riasecCodeToName(code: string): string {
    const mapping: Record<string, string> = {
      'R': 'realistic',
      'I': 'investigative',
      'A': 'artistic', 
      'S': 'social',
      'E': 'enterprising',
      'C': 'conventional'
    };
    return mapping[code] || code.toLowerCase();
  }
  
  private static calculateInterestMatch(userScores: any, careerProfile: any): number {
    if (!careerProfile) return 0;
    
    let totalMatch = 0;
    let factors = 0;
    
    Object.entries(careerProfile).forEach(([code, required]: [string, any]) => {
      const codeName = this.riasecCodeToName(code);
      if (userScores[codeName] !== undefined) {
        const difference = Math.abs(userScores[codeName] - required);
        totalMatch += Math.max(0, 100 - difference);
        factors++;
      }
    });
    
    return factors > 0 ? Math.round(totalMatch / factors) : 0;
  }
  
  private static calculatePersonalityMatch(userScores: any, careerFit: any): number {
    if (!careerFit) return 0;
    
    let totalMatch = 0;
    let factors = 0;
    
    Object.entries(careerFit).forEach(([trait, required]: [string, any]) => {
      if (userScores[trait] !== undefined) {
        const difference = Math.abs(userScores[trait] - required);
        totalMatch += Math.max(0, 100 - difference);
        factors++;
      }
    });
    
    return factors > 0 ? Math.round(totalMatch / factors) : 0;
  }
  
  static calculateReliability(answers: Answer[], questions: Question[]): any {
    // Calculate Cronbach's alpha for each section
    const sections = ['personality', 'interest'];
    const reliability: Record<string, number> = {};
    
    sections.forEach(section => {
      const sectionQuestions = questions.filter(q => q.section === section);
      const sectionAnswers = answers.filter(a => 
        sectionQuestions.some(q => q.id === a.questionId)
      );
      
      if (sectionAnswers.length > 1) {
        reliability[section] = this.cronbachsAlpha(sectionAnswers, sectionQuestions);
      }
    });
    
    return reliability;
  }
  
  private static cronbachsAlpha(answers: Answer[], questions: Question[]): number {
    // Simplified Cronbach's alpha calculation
    // In a real implementation, you'd use proper statistical libraries
    const n = questions.length;
    if (n < 2) return 0;
    
    // This is a simplified version - implement actual calculation
    return 0.85; // Placeholder - implement actual calculation
  }

  private static getComplexityWeight(difficulty: string): number {
    const weights = {
      'easy': 1,
      'medium': 1.8,
      'hard': 2.5,
      'expert': 3
    };
    return weights[difficulty as keyof typeof weights] || 1.8;
  }

  private static calculateEfficiencyBonus(timeSpent: number, questionCount: number): number {
    if (questionCount === 0) return 0;
    
    const averageTimePerQuestion = timeSpent / questionCount;
    const optimalTime = 90; // 90 seconds per question for professionals
    
    if (averageTimePerQuestion <= optimalTime && averageTimePerQuestion >= 30) {
      return Math.min(15, (optimalTime - averageTimePerQuestion) / optimalTime * 15);
    }
    return 0;
  }

  private static getProfessionalCompetencyLevel(score: number): string {
    if (score >= 90) return 'Expert';
    if (score >= 75) return 'Advanced';
    if (score >= 60) return 'Proficient';
    if (score >= 45) return 'Developing';
    return 'Foundational';
  }

  private static getBenchmarkComparison(score: number, domain: string): any {
    return {
      industryAverage: this.getIndustryBenchmark(domain),
      performanceRating: score >= 75 ? 'Above Average' : score >= 50 ? 'Average' : 'Below Average',
      improvementPotential: Math.max(0, 85 - score)
    };
  }

  private static getIndustryBenchmark(domain: string): number {
    // Simulated industry benchmarks
    const benchmarks: Record<string, number> = {
      logical: 65,
      numerical: 70,
      verbal: 68,
      spatial: 60,
      analytical: 72,
      strategic: 58
    };
    return benchmarks[domain] || 65;
  }

  private static generateProfessionalProfile(scores: any): any {
    const domains = Object.keys(scores).filter(key => key !== 'overall');
    const sortedDomains = domains
      .filter(domain => scores[domain].total > 0)
      .map(domain => ({ domain, score: scores[domain].adjusted, level: scores[domain].competencyLevel }))
      .sort((a, b) => b.score - a.score);
    
    return {
      coreStrengths: sortedDomains.slice(0, 3),
      developmentAreas: sortedDomains.slice(-2),
      leadershipIndicators: sortedDomains.filter(d => d.score >= 75),
      consistencyIndex: this.calculateConsistencyIndex(sortedDomains)
    };
  }

  private static assessLeadershipReadiness(scores: any): any {
    const leadershipDomains = ['logical', 'analytical', 'strategic'];
    const leadershipScores = leadershipDomains
      .filter(domain => scores[domain]?.adjusted)
      .map(domain => scores[domain].adjusted);
    
    const averageLeadershipScore = leadershipScores.length > 0 
      ? leadershipScores.reduce((sum, score) => sum + score, 0) / leadershipScores.length
      : 0;
    
    return {
      readinessScore: Math.round(averageLeadershipScore),
      level: averageLeadershipScore >= 80 ? 'High' : averageLeadershipScore >= 65 ? 'Medium' : 'Developing',
      keyStrengths: leadershipDomains.filter(domain => scores[domain]?.adjusted >= 75),
      developmentNeeds: leadershipDomains.filter(domain => scores[domain]?.adjusted < 65)
    };
  }

  private static calculateConsistencyIndex(sortedDomains: any[]): number {
    if (sortedDomains.length < 2) return 100;
    
    const scores = sortedDomains.map(d => d.score);
    const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
    const standardDeviation = Math.sqrt(variance);
    
    // Convert to consistency index (lower deviation = higher consistency)
    return Math.max(0, Math.min(100, 100 - (standardDeviation * 2)));
  }
}
