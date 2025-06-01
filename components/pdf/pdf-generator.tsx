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
  private margin: number = 20;
  private currentY: number = 0;

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
      await this.createRecommendations();
      await this.addPageNumbers();
      
      const fileName = `${this.userName.replace(/\s+/g, '-')}-Career-Assessment-Report-${new Date().toISOString().split('T')[0]}.pdf`;
      this.pdf.save(fileName);
      
    } catch (error) {
      console.error('PDF Generation Error:', error);
      throw new Error('Failed to generate PDF report');
    }
  }

  private async createCoverPage(): Promise<void> {
    // Header with branding - clean layout without logo
    this.pdf.setFillColor(79, 70, 229); // Indigo
    this.pdf.rect(0, 0, this.pageWidth, 55, 'F');
    
    // Main title - centered
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.setFontSize(24);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('CAREER ASSESSMENT REPORT', this.pageWidth / 2, 22, { align: 'center' });
    
    // Subtitle - closer to title
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('Personalized Career Discovery Results', this.pageWidth / 2, 34, { align: 'center' });
    
    // Professional tagline - smaller and closer
    this.pdf.setFontSize(9);
    this.pdf.setFont('helvetica', 'italic');
    this.pdf.text('Discover Your Future - Build Your Success', this.pageWidth / 2, 44, { align: 'center' });
    
    // Student information section - closer to header
    this.pdf.setFillColor(248, 250, 252); // Light gray
    this.pdf.roundedRect(this.margin, 70, this.pageWidth - 2 * this.margin, 55, 5, 5, 'F');
    
    // Student info header
    this.pdf.setTextColor(51, 65, 85); // Dark gray
    this.pdf.setFontSize(11);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('ASSESSMENT PREPARED FOR:', this.margin + 10, 85);
    
    // Student name - prominent but not oversized
    this.pdf.setFontSize(18);
    this.pdf.setTextColor(79, 70, 229);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(this.userName.toUpperCase(), this.margin + 10, 100);
    
    // Date and assessment info - closer spacing
    this.pdf.setFontSize(10);
    this.pdf.setTextColor(100, 116, 139);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text(`Report Generated: ${new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}`, this.margin + 10, 112);
    
    this.pdf.text('Assessment Type: Comprehensive Career Discovery', this.margin + 10, 120);
    
    // Key highlights box - reduced spacing
    const aptitudeScores = this.report.aptitudeScores as any;
    const careerMatches = this.report.careerMatches as any[];
    
    this.pdf.setFillColor(16, 185, 129); // Green
    this.pdf.roundedRect(this.margin, 140, this.pageWidth - 2 * this.margin, 70, 5, 5, 'F');
    
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.setFontSize(14);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('KEY ASSESSMENT HIGHLIGHTS', this.margin + 10, 155);
    
    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'normal');
    
    const aptitudeScore = aptitudeScores?.overall ? this.getScoreValue(aptitudeScores.overall) : 0;
    const topTrait = this.getTopPersonalityTrait();
    const topInterest = this.getTopInterests()[0]?.interest || 'N/A';
    
    // Two-column layout for highlights - compact
    const leftColumn = this.margin + 10;
    const rightColumn = this.margin + (this.pageWidth - 2 * this.margin) / 2 + 5;
    
    this.pdf.text(`* Overall Aptitude Score: ${aptitudeScore}%`, leftColumn, 168);
    this.pdf.text(`* Career Matches Found: ${careerMatches?.length || 0}`, rightColumn, 168);
    this.pdf.text(`* Top Personality Trait: ${topTrait}`, leftColumn, 178);
    this.pdf.text(`* Primary Interest: ${topInterest.charAt(0).toUpperCase() + topInterest.slice(1)}`, rightColumn, 178);
    
    // Assessment completion status
    this.pdf.setFontSize(9);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('Assessment Status: Complete & Analyzed', this.margin + 10, 195);
    
    // Move footer to bottom of page
    this.addCoverPageFooter();
  }

  private addCoverPageFooter(): void {
    // Professional footer with contact info at bottom of page
    const footerY = this.pageHeight - 40;
    
    this.pdf.setFillColor(51, 65, 85); // Dark gray
    this.pdf.rect(0, footerY, this.pageWidth, 40, 'F');
    
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('CONFIDENTIAL CAREER ASSESSMENT', this.margin, footerY + 12);
    
    this.pdf.setFontSize(8);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('This report contains confidential career guidance information.', this.margin, footerY + 22);
    this.pdf.text('Results are based on scientific assessment methodologies and personal responses.', this.margin, footerY + 30);
    
    // Contact/support info on the right - compact
    this.pdf.setTextColor(200, 200, 200);
    this.pdf.setFontSize(8);
    this.pdf.text('For support or questions:', this.pageWidth - this.margin - 45, footerY + 12);
    this.pdf.text('career-support@compass.edu', this.pageWidth - this.margin - 45, footerY + 22);
    this.pdf.text('www.careercompass.edu', this.pageWidth - this.margin - 45, footerY + 30);
  }

  private async createExecutiveSummary(): Promise<void> {
    this.pdf.addPage();
    this.currentY = this.margin;
    
    this.addSectionHeader('EXECUTIVE SUMMARY', '01');
    
    // Summary box
    this.pdf.setFillColor(239, 246, 255); // Light blue
    this.pdf.roundedRect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, 40, 3, 3, 'F');
    
    this.pdf.setTextColor(30, 64, 175);
    this.pdf.setFontSize(14);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('Assessment Overview', this.margin + 5, this.currentY + 10);
    
    this.pdf.setTextColor(51, 65, 85);
    this.pdf.setFontSize(11);
    this.pdf.setFont('helvetica', 'normal');
    const summaryText = `This comprehensive career assessment evaluated ${this.userName}'s aptitudes, personality traits, and interests to identify optimal career paths. The assessment combines scientific methodologies with modern career guidance principles to provide actionable insights.`;
    
    const summaryLines = this.pdf.splitTextToSize(summaryText, this.pageWidth - 2 * this.margin - 10);
    this.pdf.text(summaryLines, this.margin + 5, this.currentY + 20);
    
    this.currentY += 60;
    
    // Results grid
    this.createResultsGrid();
  }

  private createResultsGrid(): void {
    const aptitudeScores = this.report.aptitudeScores as any;
    const personalityScores = this.report.personalityScores as any;
    const interestScores = this.report.interestScores as any;
    
    const gridData = [
      {
        title: 'APTITUDE ASSESSMENT',
        score: `${aptitudeScores?.overall ? this.getScoreValue(aptitudeScores.overall) : 0}%`,
        description: 'Problem-solving and cognitive abilities',
        color: [59, 130, 246] // Blue
      },
      {
        title: 'PERSONALITY PROFILE',
        score: this.getTopPersonalityTrait(),
        description: 'Behavioral preferences and work style',
        color: [147, 51, 234] // Purple
      },
      {
        title: 'INTEREST INVENTORY',
        score: this.getTopInterests()[0]?.interest?.charAt(0).toUpperCase() + this.getTopInterests()[0]?.interest?.slice(1) || 'N/A',
        description: 'Areas of natural curiosity and motivation',
        color: [16, 185, 129] // Green
      }
    ];
    
    const cardWidth = (this.pageWidth - 2 * this.margin - 20) / 3;
    
    gridData.forEach((item, index) => {
      const x = this.margin + (cardWidth + 10) * index;
      
      // Card background with border
      this.pdf.setFillColor(255, 255, 255);
      this.pdf.setDrawColor(229, 231, 235);
      this.pdf.roundedRect(x, this.currentY, cardWidth, 50, 3, 3, 'FD');
      
      // Colored accent bar
      this.pdf.setFillColor(item.color[0], item.color[1], item.color[2]);
      this.pdf.rect(x, this.currentY, cardWidth, 3, 'F');
      
      // Title
      this.pdf.setTextColor(51, 65, 85);
      this.pdf.setFontSize(9);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.text(item.title, x + 5, this.currentY + 12);
      
      // Score
      this.pdf.setTextColor(item.color[0], item.color[1], item.color[2]);
      this.pdf.setFontSize(14);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.text(item.score, x + 5, this.currentY + 25);
      
      // Description
      this.pdf.setTextColor(100, 116, 139);
      this.pdf.setFontSize(8);
      this.pdf.setFont('helvetica', 'normal');
      const descLines = this.pdf.splitTextToSize(item.description, cardWidth - 10);
      this.pdf.text(descLines, x + 5, this.currentY + 35);
    });
    
    this.currentY += 70;
  }

  private async createDetailedResults(): Promise<void> {
    this.pdf.addPage();
    this.currentY = this.margin;
    
    this.addSectionHeader('DETAILED ASSESSMENT RESULTS', '02');
    
    // Personality section
    if (this.report.personalityScores) {
      this.addSubsectionHeader('Personality Profile Analysis');
      
      if (this.report.personalitySummary) {
        this.pdf.setTextColor(51, 65, 85);
        this.pdf.setFontSize(11);
        this.pdf.setFont('helvetica', 'normal');
        const summaryLines = this.pdf.splitTextToSize(this.report.personalitySummary, this.pageWidth - 2 * this.margin);
        this.pdf.text(summaryLines, this.margin, this.currentY);
        this.currentY += summaryLines.length * 5 + 10;
      }
      
      this.createProgressBars(this.report.personalityScores as any, 'Personality Traits', [147, 51, 234]);
    }
    
    // Interest section
    if (this.report.interestScores) {
      this.checkPageBreak(60);
      this.addSubsectionHeader('Interest Inventory Results');
      
      if (this.report.interestSummary) {
        this.pdf.setTextColor(51, 65, 85);
        this.pdf.setFontSize(11);
        this.pdf.setFont('helvetica', 'normal');
        const summaryLines = this.pdf.splitTextToSize(this.report.interestSummary, this.pageWidth - 2 * this.margin);
        this.pdf.text(summaryLines, this.margin, this.currentY);
        this.currentY += summaryLines.length * 5 + 10;
      }
      
      this.createProgressBars(this.report.interestScores as any, 'Interest Areas', [16, 185, 129]);
    }
  }

  private async createCareerMatches(): Promise<void> {
    const careerMatches = this.report.careerMatches as any[];
    
    if (!careerMatches || careerMatches.length === 0) return;
    
    this.pdf.addPage();
    this.currentY = this.margin;
    
    this.addSectionHeader('RECOMMENDED CAREER PATHS', '03');
    
    careerMatches.slice(0, 5).forEach((career, index) => {
      this.checkPageBreak(80);
      
      // Career card
      this.pdf.setFillColor(248, 250, 252);
      this.pdf.roundedRect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, 70, 3, 3, 'F');
      
      // Rank badge
      this.pdf.setFillColor(79, 70, 229);
      this.pdf.circle(this.margin + 15, this.currentY + 15, 8, 'F');
      this.pdf.setTextColor(255, 255, 255);
      this.pdf.setFontSize(12);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.text((index + 1).toString(), this.margin + 15, this.currentY + 18, { align: 'center' });
      
      // Career title
      this.pdf.setTextColor(51, 65, 85);
      this.pdf.setFontSize(14);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.text(career.title, this.margin + 30, this.currentY + 12);
      
      // Match percentage - fixed to divide by 100
      const matchPercentage = Math.round((career.matchPercentage || 0) / 100);
      this.pdf.setTextColor(16, 185, 129);
      this.pdf.setFontSize(12);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.text(`${matchPercentage}% Match`, this.pageWidth - this.margin - 30, this.currentY + 12);
      
      // Industry
      this.pdf.setTextColor(100, 116, 139);
      this.pdf.setFontSize(10);
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.text(`Industry: ${career.industry}`, this.margin + 30, this.currentY + 22);
      
      // Description
      this.pdf.setTextColor(51, 65, 85);
      this.pdf.setFontSize(10);
      const descLines = this.pdf.splitTextToSize(career.description, this.pageWidth - 2 * this.margin - 40);
      this.pdf.text(descLines, this.margin + 10, this.currentY + 32);
      
      // Details grid
      const details = [
        `Education: ${career.educationLevel}`,
        `Work Style: ${career.workStyle}`,
        `Environment: ${career.workEnvironment}`,
        `Salary: $${career.salaryRange?.median?.toLocaleString() || 'N/A'}`
      ];
      
      details.forEach((detail, detailIndex) => {
        const x = this.margin + 10 + (detailIndex % 2) * 85;
        const y = this.currentY + 50 + Math.floor(detailIndex / 2) * 8;
        this.pdf.setTextColor(100, 116, 139);
        this.pdf.setFontSize(9);
        this.pdf.text(detail, x, y);
      });
      
      this.currentY += 80;
    });
  }

  private async createRecommendations(): Promise<void> {
    const recommendations = this.report.recommendations as any[];
    const strengths = this.report.strengths as string[];
    
    this.pdf.addPage();
    this.currentY = this.margin;
    
    this.addSectionHeader('ACTION PLAN & NEXT STEPS', '04');
    
    // Strengths section
    if (strengths && strengths.length > 0) {
      this.addSubsectionHeader('Your Key Strengths');
      
      strengths.slice(0, 5).forEach((strength, index) => {
        this.checkPageBreak(15);
        
        // Create bullet point with proper spacing
        this.pdf.setTextColor(16, 185, 129);
        this.pdf.setFontSize(12);
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.text('•', this.margin, this.currentY);
        
        this.pdf.setTextColor(51, 65, 85);
        this.pdf.setFontSize(11);
        this.pdf.setFont('helvetica', 'normal');
        const strengthLines = this.pdf.splitTextToSize(strength, this.pageWidth - 2 * this.margin - 15);
        this.pdf.text(strengthLines, this.margin + 8, this.currentY);
        this.currentY += strengthLines.length * 5 + 5;
      });
      
      this.currentY += 10;
    }
    
    // Recommendations section
    if (recommendations && recommendations.length > 0) {
      this.checkPageBreak(80);
      this.addSubsectionHeader('Recommended Next Steps');
      
      recommendations.slice(0, 3).forEach((rec, index) => {
        this.checkPageBreak(50);
        
        // Step number
        this.pdf.setFillColor(59, 130, 246);
        this.pdf.roundedRect(this.margin, this.currentY, 8, 8, 2, 2, 'F');
        this.pdf.setTextColor(255, 255, 255);
        this.pdf.setFontSize(10);
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.text((index + 1).toString(), this.margin + 4, this.currentY + 5, { align: 'center' });
        
        // Career focus
        this.pdf.setTextColor(51, 65, 85);
        this.pdf.setFontSize(12);
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.text(rec.career, this.margin + 15, this.currentY + 5);
        
        this.currentY += 12;
        
        // Reason
        this.pdf.setTextColor(100, 116, 139);
        this.pdf.setFontSize(10);
        this.pdf.setFont('helvetica', 'normal');
        if (rec.reason) {
          const reasonLines = this.pdf.splitTextToSize(rec.reason, this.pageWidth - 2 * this.margin - 15);
          this.pdf.text(reasonLines, this.margin + 15, this.currentY);
          this.currentY += reasonLines.length * 5 + 8;
        }
        
        // Next steps
        if (rec.nextSteps && rec.nextSteps.length > 0) {
          this.pdf.setTextColor(59, 130, 246);
          this.pdf.setFontSize(10);
          this.pdf.setFont('helvetica', 'bold');
          this.pdf.text('Immediate Action:', this.margin + 15, this.currentY);
          
          this.currentY += 8;
          
          this.pdf.setTextColor(51, 65, 85);
          this.pdf.setFont('helvetica', 'normal');
          const nextStepLines = this.pdf.splitTextToSize(rec.nextSteps[0], this.pageWidth - 2 * this.margin - 15);
          this.pdf.text(nextStepLines, this.margin + 15, this.currentY);
          this.currentY += nextStepLines.length * 5;
        }
        
        this.currentY += 15;
      });
    }
    
    // Footer with contact info
    this.currentY = this.pageHeight - 50;
    this.pdf.setFillColor(79, 70, 229);
    this.pdf.rect(0, this.currentY, this.pageWidth, 50, 'F');
    
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.setFontSize(14);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('Need Guidance?', this.margin, this.currentY + 15);
    
    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('Connect with a career counselor to discuss your results and create a detailed action plan.', this.margin, this.currentY + 25);
    this.pdf.text('Visit our website or contact your school counselor for additional resources.', this.margin, this.currentY + 35);
  }

  // Helper methods
  private addSectionHeader(title: string, number: string): void {
    this.pdf.setFillColor(79, 70, 229);
    this.pdf.rect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, 12, 'F');
    
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.setFontSize(14);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(`${number}. ${title}`, this.margin + 5, this.currentY + 8);
    
    this.currentY += 25;
  }

  private addSubsectionHeader(title: string): void {
    this.pdf.setTextColor(79, 70, 229);
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(title, this.margin, this.currentY);
    this.currentY += 15;
  }

  private createProgressBars(scores: any, title: string, color: number[]): void {
    Object.entries(scores)
      .sort(([,a], [,b]) => this.getScoreValue(b) - this.getScoreValue(a))
      .forEach(([key, value]) => {
        const score = this.getScoreValue(value);
        
        // Label
        this.pdf.setTextColor(51, 65, 85);
        this.pdf.setFontSize(10);
        this.pdf.setFont('helvetica', 'normal');
        this.pdf.text(key.charAt(0).toUpperCase() + key.slice(1), this.margin, this.currentY);
        
        // Score
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.text(`${score}%`, this.pageWidth - this.margin - 15, this.currentY);
        
        // Progress bar background
        this.pdf.setFillColor(229, 231, 235);
        this.pdf.roundedRect(this.margin, this.currentY + 2, this.pageWidth - 2 * this.margin - 25, 4, 2, 2, 'F');
        
        // Progress bar fill
        const fillWidth = ((this.pageWidth - 2 * this.margin - 25) * score) / 100;
        this.pdf.setFillColor(color[0], color[1], color[2]);
        this.pdf.roundedRect(this.margin, this.currentY + 2, fillWidth, 4, 2, 2, 'F');
        
        this.currentY += 12;
      });
    
    this.currentY += 10;
  }

  private checkPageBreak(requiredSpace: number): void {
    if (this.currentY + requiredSpace > this.pageHeight - this.margin) {
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
      this.pdf.text(`Page ${i} of ${totalPages}`, this.pageWidth - this.margin, this.pageHeight - 10, { align: 'right' });
      
      if (i > 1) {
        this.pdf.text('Career Assessment Report', this.margin, this.pageHeight - 10);
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
