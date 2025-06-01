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
  options: any;
}

export class AssessmentScoring {
  
  static calculateAptitudeScores(answers: Answer[], questions: Question[]) {
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
          // For seeded data, the correct answer is stored in the options array
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
      
      scores[domain] = {
        raw: rawScore,
        adjusted: Math.min(100, rawScore + timeBonus),
        correct: correctCount,
        total: domainQuestions.length,
        timeSpent: totalTime
      };
    });
    
    // Calculate overall aptitude score
    const validScores = Object.values(scores).filter((score: any) => score.total > 0);
    const overall = validScores.length > 0 
      ? validScores.reduce((sum: number, score: any) => sum + score.adjusted, 0) / validScores.length
      : 0;
    
    scores.overall = Math.round(overall);
    
    return scores;
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
}
