'use client';

import { Report } from '@prisma/client';

interface PDFGeneratorProps {
  report: Report;
  userName?: string;
  onGenerationStart?: () => void;
  onGenerationComplete?: () => void;
  onError?: (error: string) => void;
}

export class PDFGenerator {
  private report: Report;
  private userName: string;
  private pdf: any;
  private pageWidth: number = 210; // A4 width in mm
  private pageHeight: number = 297; // A4 height in mm
  private margin: number = 15;
  private currentY: number = 0;
  private lineHeight: number = 6; // Increased line height

  constructor(report: Report, userName: string = 'Student') {
    this.report = report;
    this.userName = userName;
  }

  async generatePDF(): Promise<void> {
    try {
      const jsPDF = (await import('jspdf')).default;
      
      this.pdf = new jsPDF('p', 'mm', 'a4');
      this.pageWidth = this.pdf.internal.pageSize.getWidth();
      this.pageHeight = this.pdf.internal.pageSize.getHeight();
      
      await this.createCoverPage();
      await this.createExecutiveSummary();
      await this.createDetailedResults();
      await this.createCareerMatches();
      await this.addPageNumbers();
      
      const fileName = `${this.userName.replace(/\s+/g, '-')}-Career-Assessment-Report-${new Date().toISOString().split('T')[0]}.pdf`;
      this.pdf.save(fileName);
      
    } catch (error) {
      console.error('PDF Generation Error:', error);
      throw new Error('Failed to generate PDF report');
    }
  }

  private async createCoverPage(): Promise<void> {
    // Header with professional branding
    this.pdf.setFillColor(79, 70, 229);
    this.pdf.rect(0, 0, this.pageWidth, 50, 'F');
    
    // Main title
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.setFontSize(22);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('STUDENT ASSESSMENT REPORT', this.pageWidth / 2, 20, { align: 'center' });
    
    // Subtitle
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('Career Guidance Program', this.pageWidth / 2, 32, { align: 'center' });
    
    // Professional tagline
    this.pdf.setFontSize(9);
    this.pdf.setFont('helvetica', 'italic');
    this.pdf.text('Discover Your Future - Build Your Success', this.pageWidth / 2, 42, { align: 'center' });
    
    // Student information section
    this.pdf.setFillColor(248, 250, 252);
    this.pdf.roundedRect(this.margin, 65, this.pageWidth - 2 * this.margin, 50, 3, 3, 'F');
    
    // Student name
    this.pdf.setTextColor(79, 70, 229);
    this.pdf.setFontSize(18);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(this.userName.toUpperCase(), this.pageWidth / 2, 85, { align: 'center' });
    
    // Date and report info
    this.pdf.setFontSize(10);
    this.pdf.setTextColor(100, 116, 139);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text(`Assessment Date: ${new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}`, this.pageWidth / 2, 100, { align: 'center' });
    
    this.pdf.text(`Report ID: ${Math.random().toString(36).substr(2, 8).toUpperCase()}`, this.pageWidth / 2, 108, { align: 'center' });

    // Welcome message section
    this.pdf.setFillColor(239, 246, 255);
    this.pdf.roundedRect(this.margin, 130, this.pageWidth - 2 * this.margin, 35, 3, 3, 'F');
    
    this.pdf.setTextColor(30, 64, 175);
    this.pdf.setFontSize(11);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(`Dear ${this.userName},`, this.margin + 8, 145);
    
    this.pdf.setTextColor(51, 65, 85);
    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'normal');
    const welcomeText = `Thank you for taking our Career Guidance Assessment. The findings are analyzed and interpreted to comprise this comprehensive report with your Aptitude, Interest and Personality profile.`;
    
    const welcomeLines = this.pdf.splitTextToSize(welcomeText, this.pageWidth - 2 * this.margin - 16);
    let yPos = 155;
    welcomeLines.forEach((line: string) => {
      this.pdf.text(line, this.margin + 8, yPos);
      yPos += this.lineHeight;
    });

    // Assessment overview highlights
    const aptitudeScores = this.report.aptitudeScores as any;
    
    this.pdf.setFillColor(16, 185, 129);
    this.pdf.roundedRect(this.margin, 180, this.pageWidth - 2 * this.margin, 30, 3, 3, 'F');
    
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('ASSESSMENT OVERVIEW', this.pageWidth / 2, 195, { align: 'center' });
    
    this.pdf.setFontSize(9);
    this.pdf.setFont('helvetica', 'normal');
    
    const avgAptitude = aptitudeScores ? Math.round(Object.values(aptitudeScores).reduce((acc: number, val: any) => acc + this.getScoreValue(val), 0) / Object.values(aptitudeScores).length) : 0;
    const topTrait = this.getTopPersonalityTrait();
    const topInterest = this.getTopInterests()[0]?.interest || 'N/A';
    
    this.pdf.text(`Cognitive Aptitude: ${avgAptitude}%  •  Dominant Trait: ${topTrait}  •  Primary Interest: ${topInterest.charAt(0).toUpperCase() + topInterest.slice(1)}`, this.pageWidth / 2, 205, { align: 'center' });
    
    this.addCoverPageFooter();
  }

  private addCoverPageFooter(): void {
    const footerY = this.pageHeight - 35;
    
    this.pdf.setFillColor(51, 65, 85);
    this.pdf.rect(0, footerY, this.pageWidth, 35, 'F');
    
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.setFontSize(9);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('CONFIDENTIAL CAREER ASSESSMENT', this.margin, footerY + 12);
    
    this.pdf.setFontSize(7);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('This report contains confidential career guidance information.', this.margin, footerY + 20);
    this.pdf.text('Results are based on scientific assessment methodologies.', this.margin, footerY + 27);
    
    this.pdf.setTextColor(200, 200, 200);
    this.pdf.setFontSize(7);
    this.pdf.text('For support: career-support@compass.edu', this.pageWidth - this.margin - 50, footerY + 12);
    this.pdf.text('www.careercompass.edu', this.pageWidth - this.margin - 50, footerY + 20);
  }

  private async createExecutiveSummary(): Promise<void> {
    this.pdf.addPage();
    this.currentY = this.margin;
    
    this.addSectionHeader('ABOUT THE REPORT');
    
    this.pdf.setFillColor(239, 246, 255);
    this.pdf.roundedRect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, 40, 3, 3, 'F');
    
    this.pdf.setTextColor(51, 65, 85);
    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'normal');
    const aboutText = `This report provides an in-depth description of your responses to the Career Guidance Program Assessment. Designed to help you identify and understand your potential, personality and career interests, this report can start you on the journey of matching your attributes with your academic and career goals.`;
    
    const aboutLines = this.pdf.splitTextToSize(aboutText, this.pageWidth - 2 * this.margin - 10);
    let yPos = this.currentY + 8;
    aboutLines.forEach((line: string) => {
      this.pdf.text(line, this.margin + 5, yPos);
      yPos += this.lineHeight;
    });
    
    this.currentY += 50;
    
    // Important Notes
    this.pdf.setTextColor(79, 70, 229);
    this.pdf.setFontSize(11);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('AS YOU READ THROUGH THIS REPORT:', this.margin, this.currentY);
    this.currentY += 12;
    
    const notes = [
      'This report is based on the data provided by you',
      'Consider multiple factors while choosing your career options',
      'Gather comprehensive information when making career decisions',
      'Supplement these results with academic grades and other information'
    ];
    
    notes.forEach(note => {
      this.checkPageBreak(8);
      this.pdf.setTextColor(51, 65, 85);
      this.pdf.setFontSize(9);
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.text('•', this.margin, this.currentY);
      const noteLines = this.pdf.splitTextToSize(note, this.pageWidth - 2 * this.margin - 10);
      let yPos = this.currentY;
      noteLines.forEach((line: string) => {
        this.pdf.text(line, this.margin + 8, yPos);
        yPos += this.lineHeight;
      });
      this.currentY += noteLines.length * this.lineHeight + 2;
    });
    
    this.currentY += 10;
    this.createResultsGrid();
  }

  private createResultsGrid(): void {
    this.checkPageBreak(60);
    
    const aptitudeScores = this.report.aptitudeScores as any;
    const personalityScores = this.report.personalityScores as any;
    const interestScores = this.report.interestScores as any;
    
    const gridData = [
      {
        title: 'APTITUDE',
        score: `${aptitudeScores ? Math.round(Object.values(aptitudeScores).reduce((acc: number, val: any) => acc + this.getScoreValue(val), 0) / Object.values(aptitudeScores).length) : 0}%`,
        description: 'Problem-solving abilities',
        color: [59, 130, 246]
      },
      {
        title: 'PERSONALITY',
        score: this.getTopPersonalityTrait(),
        description: 'Behavioral preferences',
        color: [147, 51, 234]
      },
      {
        title: 'INTERESTS',
        score: this.getTopInterests()[0]?.interest?.charAt(0).toUpperCase() + this.getTopInterests()[0]?.interest?.slice(1) || 'N/A',
        description: 'Areas of motivation',
        color: [16, 185, 129]
      }
    ];
    
    const cardWidth = (this.pageWidth - 2 * this.margin - 10) / 3;
    
    gridData.forEach((item, index) => {
      const x = this.margin + (cardWidth + 5) * index;
      
      this.pdf.setFillColor(255, 255, 255);
      this.pdf.setDrawColor(229, 231, 235);
      this.pdf.roundedRect(x, this.currentY, cardWidth, 40, 2, 2, 'FD');
      
      this.pdf.setFillColor(item.color[0], item.color[1], item.color[2]);
      this.pdf.rect(x, this.currentY, cardWidth, 2, 'F');
      
      this.pdf.setTextColor(51, 65, 85);
      this.pdf.setFontSize(8);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.text(item.title, x + 3, this.currentY + 10);
      
      this.pdf.setTextColor(item.color[0], item.color[1], item.color[2]);
      this.pdf.setFontSize(12);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.text(item.score, x + 3, this.currentY + 20);
      
      this.pdf.setTextColor(100, 116, 139);
      this.pdf.setFontSize(7);
      this.pdf.setFont('helvetica', 'normal');
      const descLines = this.pdf.splitTextToSize(item.description, cardWidth - 6);
      this.pdf.text(descLines, x + 3, this.currentY + 30);
    });
    
    this.currentY += 50;
  }

  private async createDetailedResults(): Promise<void> {
    this.pdf.addPage();
    this.currentY = this.margin;
    
    this.addSectionHeader('SECTION I - PSYCHOMETRIC ANALYSIS');
    
    this.pdf.setTextColor(51, 65, 85);
    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('Understanding your abilities, personal characteristics, and interests', this.margin, this.currentY);
    this.currentY += 15;

    // A. Aptitude Profile with Chart
    this.addSubsectionHeader('A. APTITUDE PROFILE');
    this.pdf.setTextColor(100, 116, 139);
    this.pdf.setFontSize(9);
    this.pdf.text('This section helps you understand your potential skills and abilities.', this.margin, this.currentY);
    this.currentY += 12;
    
    if (this.report.aptitudeScores) {
      this.createSimpleBarChart(this.report.aptitudeScores as any, 'Aptitude Analysis', [59, 130, 246]);
      this.createAptitudeAnalysis(this.report.aptitudeScores as any);
    }
    
    // B. Personality Profile with Chart
    this.checkPageBreak(100);
    this.addSubsectionHeader('B. PERSONALITY PROFILE');
    this.pdf.setTextColor(100, 116, 139);
    this.pdf.setFontSize(9);
    this.pdf.text('This section elaborates upon your personal traits and characteristics.', this.margin, this.currentY);
    this.currentY += 12;
    
    if (this.report.personalityScores) {
      this.createSimpleBarChart(this.report.personalityScores as any, 'Personality Traits', [147, 51, 234]);
      this.createPersonalityAnalysis(this.report.personalityScores as any);
    }
    
    // C. Interest Profile with Chart
    this.checkPageBreak(100);
    this.addSubsectionHeader('C. INTEREST PROFILE (RIASEC)');
    this.pdf.setTextColor(100, 116, 139);
    this.pdf.setFontSize(9);
    this.pdf.text('Getting familiar with your interests to determine work areas you will enjoy.', this.margin, this.currentY);
    this.currentY += 12;
    
    if (this.report.interestScores) {
      this.createSimpleBarChart(this.report.interestScores as any, 'Interest Areas', [16, 185, 129]);
      this.createInterestAnalysis(this.report.interestScores as any);
    }
  }

  private createSimpleBarChart(scores: any, title: string, color: number[]): void {
    const chartWidth = this.pageWidth - 2 * this.margin;
    const chartHeight = 50;
    const maxScore = Math.max(...Object.values(scores).map((score: any) => this.getScoreValue(score)));
    
    // Chart background
    this.pdf.setFillColor(248, 250, 252);
    this.pdf.roundedRect(this.margin, this.currentY, chartWidth, chartHeight, 3, 3, 'F');
    
    // Chart title
    this.pdf.setTextColor(51, 65, 85);
    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(title, this.margin + 5, this.currentY + 10);
    
    const entries = Object.entries(scores);
    const barWidth = (chartWidth - 20) / entries.length;
    
    entries.forEach(([key, scoreData], index) => {
      const score = this.getScoreValue(scoreData);
      const barHeight = (score / 100) * 25; // Max bar height 25mm
      const x = this.margin + 10 + (index * barWidth);
      const y = this.currentY + chartHeight - 15 - barHeight;
      
      // Draw bar
      this.pdf.setFillColor(color[0], color[1], color[2]);
      this.pdf.roundedRect(x, y, barWidth - 2, barHeight, 1, 1, 'F');
      
      // Add score label on top of bar
      this.pdf.setTextColor(color[0], color[1], color[2]);
      this.pdf.setFontSize(8);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.text(`${Math.round(score)}%`, x + (barWidth - 2) / 2, y - 2, { align: 'center' });
      
      // Add key label at bottom
      this.pdf.setTextColor(100, 116, 139);
      this.pdf.setFontSize(7);
      this.pdf.setFont('helvetica', 'normal');
      const keyLabel = key.charAt(0).toUpperCase() + key.slice(1).substring(0, 8);
      this.pdf.text(keyLabel, x + (barWidth - 2) / 2, this.currentY + chartHeight - 5, { align: 'center' });
    });
    
    this.currentY += chartHeight + 10;
  }

  private createAptitudeAnalysis(scores: any): void {
    this.pdf.setTextColor(59, 130, 246);
    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('Potential Areas Analysis:', this.margin, this.currentY);
    this.currentY += 10;

    Object.entries(scores).forEach(([key, scoreData]) => {
      this.checkPageBreak(20);
      
      const score = this.getScoreValue(scoreData);
      let level = 'Medium Potential';
      let description = 'can be developed further with effort and guidance';
      let color = [245, 158, 11]; // Orange
      
      if (score >= 75) {
        level = 'High Potential';
        description = 'are your strength areas with respect to your aptitude';
        color = [34, 197, 94]; // Green
      } else if (score < 50) {
        level = 'Low Potential';
        description = 'demonstrate lower ability and may need more development';
        color = [239, 68, 68]; // Red
      }

      // Create a compact box for each aptitude
      this.pdf.setFillColor(248, 250, 252);
      this.pdf.roundedRect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, 15, 2, 2, 'F');
      
      this.pdf.setTextColor(51, 65, 85);
      this.pdf.setFontSize(9);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.text(`${key.charAt(0).toUpperCase() + key.slice(1)} Aptitude`, this.margin + 5, this.currentY + 6);
      
      this.pdf.setTextColor(color[0], color[1], color[2]);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.text(`${level} (${Math.round(score)}%)`, this.pageWidth - this.margin - 40, this.currentY + 6);
      
      this.pdf.setTextColor(100, 116, 139);
      this.pdf.setFontSize(8);
      this.pdf.setFont('helvetica', 'normal');
      const analysisText = `Your ${key} aptitude skills ${description}.`;
      const analysisLines = this.pdf.splitTextToSize(analysisText, this.pageWidth - 2 * this.margin - 10);
      this.pdf.text(analysisLines, this.margin + 5, this.currentY + 11);
      
      this.currentY += 18;
    });
    
    this.currentY += 5;
  }

  private createPersonalityAnalysis(scores: any): void {
    this.pdf.setTextColor(147, 51, 234);
    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('Personality Orientations:', this.margin, this.currentY);
    this.currentY += 10;

    const orientations: {[key: string]: {title: string, low: string, high: string}} = {
      openness: {
        title: 'LEARNING ORIENTATION',
        low: 'Practical, Realistic',
        high: 'Imaginative, Experimental'
      },
      conscientiousness: {
        title: 'CONSCIENTIOUSNESS',
        low: 'Easy going, Impulsive',
        high: 'Focused, Organized'
      },
      extraversion: {
        title: 'INTERPERSONAL ORIENTATION',
        low: 'Quiet, Introvert',
        high: 'Social, Extrovert'
      },
      agreeableness: {
        title: 'ATTITUDINAL ORIENTATION',
        low: 'Tough, Competitive',
        high: 'Generous, Cooperative'
      },
      neuroticism: {
        title: 'EMOTIONAL ORIENTATION',
        low: 'Strong, Resilient, Calm',
        high: 'Sensitive, Nervous, Anxious'
      }
    };

    Object.entries(scores).forEach(([key, scoreData]) => {
      this.checkPageBreak(15);
      
      const score = this.getScoreValue(scoreData);
      const orientation = orientations[key] || {title: key.toUpperCase(), low: 'Low', high: 'High'};
      
      this.pdf.setFillColor(248, 250, 252);
      this.pdf.roundedRect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, 12, 2, 2, 'F');
      
      this.pdf.setTextColor(147, 51, 234);
      this.pdf.setFontSize(8);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.text(orientation.title, this.margin + 5, this.currentY + 5);
      
      this.pdf.setTextColor(147, 51, 234);
      this.pdf.text(`${Math.round(score)}%`, this.pageWidth - this.margin - 20, this.currentY + 5);
      
      // Draw scale bar
      const barWidth = 60;
      const barX = this.margin + 5;
      const barY = this.currentY + 8;
      
      this.pdf.setFillColor(229, 231, 235);
      this.pdf.roundedRect(barX, barY, barWidth, 2, 1, 1, 'F');
      
      this.pdf.setFillColor(147, 51, 234);
      this.pdf.roundedRect(barX, barY, (barWidth * score) / 100, 2, 1, 1, 'F');
      
      this.currentY += 15;
    });
    
    this.currentY += 5;
  }

  private createInterestAnalysis(scores: any): void {
    this.pdf.setTextColor(16, 185, 129);
    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('Your Top Interest Themes:', this.margin, this.currentY);
    this.currentY += 10;

    const topThemes = Object.entries(scores)
      .sort(([,a], [,b]) => this.getScoreValue(b) - this.getScoreValue(a))
      .slice(0, 3);

    const types: {[key: string]: {title: string, description: string}} = {
      realistic: {title: 'Realistic (Doer)', description: 'Practical, hands-on, problem-solvers'},
      investigative: {title: 'Investigative (Thinker)', description: 'Analytical, intellectual, scientific'},
      artistic: {title: 'Artistic (Creator)', description: 'Creative, expressive, original'},
      social: {title: 'Social (Helper)', description: 'Helpful, caring, teaching-oriented'},
      enterprising: {title: 'Enterprising (Persuader)', description: 'Energetic, ambitious, sociable'},
      conventional: {title: 'Conventional (Organizer)', description: 'Detail-oriented, organized, clerical'}
    };

    this.pdf.setTextColor(16, 185, 129);
    this.pdf.setFontSize(9);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(`${topThemes.map(([key]) => types[key]?.title.split(' ')[0] || key).join(', ')}`, this.margin, this.currentY);
    this.currentY += 6;
    
    this.pdf.text(`You are a ${topThemes.map(([key]) => types[key]?.title.match(/\(([^)]+)\)/)?.[1] || key).join(', ')}`, this.margin, this.currentY);
    this.currentY += 12;

    topThemes.forEach(([key, scoreData], index) => {
      this.checkPageBreak(15);
      
      const score = this.getScoreValue(scoreData);
      const type = types[key] || {title: key, description: ''};
      
      this.pdf.setFillColor(248, 250, 252);
      this.pdf.roundedRect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, 12, 2, 2, 'F');
      
      this.pdf.setTextColor(16, 185, 129);
      this.pdf.setFontSize(9);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.text(`${index + 1}. ${type.title}`, this.margin + 5, this.currentY + 5);
      
      this.pdf.setTextColor(16, 185, 129);
      this.pdf.text(`${Math.round(score)}`, this.pageWidth - this.margin - 15, this.currentY + 5);
      
      this.pdf.setTextColor(100, 116, 139);
      this.pdf.setFontSize(8);
      this.pdf.setFont('helvetica', 'normal');
      const descLines = this.pdf.splitTextToSize(type.description, this.pageWidth - 2 * this.margin - 10);
      this.pdf.text(descLines, this.margin + 5, this.currentY + 9);
      
      this.currentY += 15;
    });
    
    this.currentY += 5;
  }

  private async createCareerMatches(): Promise<void> {
    const recommendations = this.report.recommendations as any[];
    
    if (!recommendations || recommendations.length === 0) {
      this.pdf.addPage();
      this.currentY = this.margin;
      this.addSectionHeader('SECTION II - CAREER FITMENT ANALYSIS');
      this.pdf.setTextColor(100, 116, 139);
      this.pdf.setFontSize(10);
      this.pdf.text('Complete your assessment to see career recommendations.', this.margin, this.currentY);
      this.addSectionThreeSummary();
      return;
    }
    
    this.pdf.addPage();
    this.currentY = this.margin;
    
    this.addSectionHeader('SECTION II - CAREER FITMENT ANALYSIS');
    
    this.pdf.setTextColor(51, 65, 85);
    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('Your overall fitment to broad career fields', this.margin, this.currentY);
    this.currentY += 15;

    // Career Cluster Fitment Chart
    this.addSubsectionHeader('Career Cluster Fitment');
    this.createCareerFitmentChart(recommendations);
    
    // Detailed career recommendations
    this.checkPageBreak(40);
    this.addSubsectionHeader('Top Career Recommendations');
    
    recommendations.slice(0, 4).forEach((rec, index) => {
      this.checkPageBreak(35);
      
      let matchPercentage = 0;
      const directPercentage = rec.matchPercentage || rec.match || rec.percentage || rec.score || rec.compatibility;
      
      if (directPercentage !== undefined && directPercentage !== null && !isNaN(directPercentage)) {
        if (directPercentage > 100) {
          matchPercentage = Math.round(directPercentage / 100);
        } else if (directPercentage <= 1 && directPercentage > 0) {
          matchPercentage = Math.round(directPercentage * 100);
        } else {
          matchPercentage = Math.round(directPercentage);
        }
      }
      
      if (matchPercentage === 0 && rec.description && typeof rec.description === 'string') {
        const matches = rec.description.match(/(\d+)%\s*compatibility/i) || rec.description.match(/(\d+)%/);
        if (matches && matches[1]) {
          matchPercentage = parseInt(matches[1]);
        }
      }
      
      if (matchPercentage === 0) {
        matchPercentage = Math.max(85 - (index * 5), 60);
      }
      
      const title = (rec.title || rec.career || `Career Option ${index + 1}`).replace('Pursue ', '');
      const description = rec.description || 'Career recommendation based on your assessment results.';
      
      const safeTitle = String(title).trim();
      const safeDescription = String(description).trim();
      
      if (!safeTitle || safeTitle === 'undefined' || safeTitle === 'null') {
        return;
      }
      
      // Career recommendation card - more compact
      this.pdf.setFillColor(248, 250, 252);
      this.pdf.roundedRect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, 30, 3, 3, 'F');
      
      // Rank number
      this.pdf.setFillColor(79, 70, 229);
      this.pdf.circle(this.margin + 10, this.currentY + 10, 5, 'F');
      this.pdf.setTextColor(255, 255, 255);
      this.pdf.setFontSize(9);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.text((index + 1).toString(), this.margin + 10, this.currentY + 12, { align: 'center' });
      
      // Career title and percentage
      this.pdf.setTextColor(51, 65, 85);
      this.pdf.setFontSize(11);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.text(safeTitle.substring(0, 40), this.margin + 20, this.currentY + 8);
      
      this.pdf.setTextColor(16, 185, 129);
      this.pdf.setFontSize(10);
      this.pdf.text(`${matchPercentage}% Match`, this.pageWidth - this.margin - 25, this.currentY + 8);
      
      // Match percentage bar
      const barWidth = 40;
      const barHeight = 3;
      const barX = this.pageWidth - this.margin - 25 - barWidth;
      const barY = this.currentY + 12;
      
      this.pdf.setFillColor(229, 231, 235);
      this.pdf.roundedRect(barX, barY, barWidth, barHeight, 1, 1, 'F');
      
      this.pdf.setFillColor(16, 185, 129);
      this.pdf.roundedRect(barX, barY, (barWidth * matchPercentage) / 100, barHeight, 1, 1, 'F');
      
      // Description - larger font and better spacing
      if (safeDescription && safeDescription !== 'undefined') {
        this.pdf.setTextColor(100, 116, 139);
        this.pdf.setFontSize(9);
        this.pdf.setFont('helvetica', 'normal');
        
        const cleanDescription = safeDescription
          .replace(/Based on your assessment results,?\s*/i, '')
          .replace(/This role aligns well with your interests and personality traits\.?\s*/i, '')
          .trim()
          .substring(0, 120);
        
        if (cleanDescription.length > 0) {
          const descLines = this.pdf.splitTextToSize(cleanDescription, this.pageWidth - 2 * this.margin - 25);
          let yPos = this.currentY + 18;
          descLines.slice(0, 2).forEach((line: string) => {
            this.pdf.text(line, this.margin + 8, yPos);
            yPos += this.lineHeight;
          });
        }
      }
      
      this.currentY += 35;
    });
    
    this.addSectionThreeSummary();
  }

  private createCareerFitmentChart(recommendations: any[]): void {
    const chartWidth = this.pageWidth - 2 * this.margin;
    const maxItems = Math.min(recommendations.length, 6);
    const itemHeight = 8;
    const chartHeight = maxItems * itemHeight + 15;
    
    this.pdf.setFillColor(248, 250, 252);
    this.pdf.roundedRect(this.margin, this.currentY, chartWidth, chartHeight, 3, 3, 'F');
    
    recommendations.slice(0, maxItems).forEach((rec, index) => {
      let matchPercentage = 0;
      if (rec.description && typeof rec.description === 'string') {
        const matches = rec.description.match(/(\d+)%\s*compatibility/i) || rec.description.match(/(\d+)%/);
        if (matches && matches[1]) {
          matchPercentage = parseInt(matches[1]);
        }
      }
      if (matchPercentage === 0) {
        matchPercentage = Math.max(85 - (index * 3), 55);
      }
      
      const itemY = this.currentY + 8 + (index * itemHeight);
      const barMaxWidth = chartWidth - 80;
      const barWidth = (barMaxWidth * matchPercentage) / 100;
      
      const careerName = (rec.title || rec.career || `Career ${index + 1}`)
        .replace('Pursue ', '')
        .substring(0, 25);
      
      this.pdf.setTextColor(51, 65, 85);
      this.pdf.setFontSize(8);
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.text(careerName, this.margin + 5, itemY + 4);
      
      this.pdf.setFillColor(229, 231, 235);
      this.pdf.roundedRect(this.margin + 70, itemY + 1, barMaxWidth, 4, 2, 2, 'F');
      
      this.pdf.setFillColor(79, 70, 229);
      this.pdf.roundedRect(this.margin + 70, itemY + 1, barWidth, 4, 2, 2, 'F');
      
      this.pdf.setTextColor(79, 70, 229);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.text(`${matchPercentage}`, this.margin + chartWidth - 15, itemY + 4);
    });
    
    this.currentY += chartHeight + 15;
  }

  private addSectionThreeSummary(): void {
    this.pdf.addPage();
    this.currentY = this.margin;
    
    this.addSectionHeader('SECTION III - SUMMARY & RECOMMENDATIONS');
    
    this.pdf.setTextColor(51, 65, 85);
    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('Detailed and comprehensive analysis of your career recommendations', this.margin, this.currentY);
    this.currentY += 20;

    // Strengths section
    const strengths = this.report.strengths as string[];
    if (strengths && strengths.length > 0) {
      this.addSubsectionHeader('Your Key Strengths');
      
      strengths.slice(0, 4).forEach((strength, index) => {
        this.checkPageBreak(12);
        
        this.pdf.setTextColor(16, 185, 129);
        this.pdf.setFontSize(10);
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.text('•', this.margin, this.currentY);
        
        this.pdf.setTextColor(51, 65, 85);
        this.pdf.setFontSize(9);
        this.pdf.setFont('helvetica', 'normal');
        const strengthLines = this.pdf.splitTextToSize(strength, this.pageWidth - 2 * this.margin - 10);
        let yPos = this.currentY;
        strengthLines.forEach((line: string) => {
          this.pdf.text(line, this.margin + 8, yPos);
          yPos += this.lineHeight;
        });
        this.currentY += strengthLines.length * this.lineHeight + 3;
      });
      
      this.currentY += 10;
    }

    // Important recommendations
    this.checkPageBreak(40);
    this.addSubsectionHeader('Important Recommendations');
    
    const recommendations = [
      'This report is based on data provided by you on assessment tools',
      'Consider multiple factors while finalizing career options',
      'Gather comprehensive information when making career decisions',
      'Supplement results with academic grades and other information',
      'Discuss these results with parents and career counselors'
    ];
    
    recommendations.forEach(rec => {
      this.checkPageBreak(10);
      
      this.pdf.setTextColor(79, 70, 229);
      this.pdf.setFontSize(9);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.text('•', this.margin, this.currentY);
      
      this.pdf.setTextColor(51, 65, 85);
      this.pdf.setFont('helvetica', 'normal');
      const recLines = this.pdf.splitTextToSize(rec, this.pageWidth - 2 * this.margin - 10);
      let yPos = this.currentY;
      recLines.forEach((line: string) => {
        this.pdf.text(line, this.margin + 8, yPos);
        yPos += this.lineHeight;
      });
      this.currentY += recLines.length * this.lineHeight + 3;
    });
    
    this.addReportFooter();
  }

  private addReportFooter(): void {
    this.currentY = this.pageHeight - 40;
    this.pdf.setFillColor(79, 70, 229);
    this.pdf.rect(0, this.currentY, this.pageWidth, 40, 'F');
    
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('Need Guidance?', this.margin, this.currentY + 12);
    
    this.pdf.setFontSize(9);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('Connect with a career counselor to discuss your results and create an action plan.', this.margin, this.currentY + 22);
    this.pdf.text('Visit our website or contact your school counselor for additional resources.', this.margin, this.currentY + 30);
  }

  private addSectionHeader(title: string): void {
    this.pdf.setFillColor(79, 70, 229);
    this.pdf.rect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, 10, 'F');
    
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(title, this.margin + 5, this.currentY + 7);
    
    this.currentY += 18;
  }

  private addSubsectionHeader(title: string): void {
    this.pdf.setTextColor(79, 70, 229);
    this.pdf.setFontSize(11);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(title, this.margin, this.currentY);
    this.currentY += 12;
  }

  private checkPageBreak(requiredSpace: number): void {
    if (this.currentY + requiredSpace > this.pageHeight - 50) {
      this.pdf.addPage();
      this.currentY = this.margin;
    }
  }

  private addPageNumbers(): void {
    const totalPages = this.pdf.internal.getNumberOfPages();
    
    for (let i = 1; i <= totalPages; i++) {
      this.pdf.setPage(i);
      this.pdf.setTextColor(150, 150, 150);
      this.pdf.setFontSize(8);
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.text(`Page ${i} of ${totalPages}`, this.pageWidth - this.margin, this.pageHeight - 8, { align: 'right' });
      
      if (i > 1) {
        this.pdf.text('Career Assessment Report', this.margin, this.pageHeight - 8);
      }
    }
  }

  private getScoreValue(score: any): number {
    if (typeof score === 'number') return Math.round(score);
    if (typeof score === 'object' && score !== null) {
      return Math.round(score.adjusted || score.total || score.raw || 0);
    }
    return 0;
  }

  private getTopPersonalityTrait(): string {
    const personalityScores = this.report.personalityScores as any;
    if (!personalityScores) return 'N/A';
    const traits = Object.entries(personalityScores);
    if (traits.length === 0) return 'N/A';
    const topTrait = traits.sort(([,a], [,b]) => (b as number) - (a as number))[0];
    return topTrait[0].charAt(0).toUpperCase() + topTrait[0].slice(1);
  }

  private getTopInterests(): Array<{interest: string, score: any}> {
    const interestScores = this.report.interestScores as any;
    if (!interestScores) return [];
    return Object.entries(interestScores)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([interest, score]) => ({ interest, score }));
  }
}

export async function generateProfessionalPDF(
  report: Report, 
  userName: string,
  onStart?: () => void,
  onComplete?: () => void,
  onError?: (error: string) => void
): Promise<void> {
  try {
    onStart?.();
    const generator = new PDFGenerator(report, userName);
    await generator.generatePDF();
    onComplete?.();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate PDF';
    onError?.(errorMessage);
    throw error;
  }
}
