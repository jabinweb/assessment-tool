'use client';

import { Report } from '@prisma/client';
import { SchoolStudentReport } from './school-student-report';
import { CollegeStudentReport } from './college-student-report';
import { ProfessionalReport } from './professional-report';

interface AssessmentTypeReportProps {
  report: Report & {
    user: {
      name?: string;
      email?: string;
      age?: number;
      gradeLevel?: string;
      schoolName?: string;
    };
  };
}

export function AssessmentTypeReport({ report }: AssessmentTypeReportProps) {
  // Transform report data to match the expected data format
  const transformReportToData = () => {
    return {
      user: report.user,
      scores: {
        aptitude: typeof report.aptitudeScores === 'object' ? report.aptitudeScores as Record<string, any> : {},
        personality: typeof report.personalityScores === 'object' ? report.personalityScores as Record<string, number> : {},
        interest: typeof report.interestScores === 'object' ? report.interestScores as Record<string, number> : {}
      },
      careerMatches: Array.isArray(report.careerMatches) ? report.careerMatches : 
                     typeof report.careerMatches === 'object' && report.careerMatches ? 
                     Object.values(report.careerMatches) : [],
      sessionId: report.id
    };
  };

  // Determine which report component to render based on target audience
  const renderReportByType = () => {
    const data = transformReportToData();
    
    switch (report.targetAudience) {
      case 'school_student':
        return <SchoolStudentReport 
          data={data} 
          variant={report.reportType === 'simplified' ? 'basic' : 'comprehensive'}
          showParentSection={true}
          includeGamification={true}
        />;
      case 'college_student':
        return <CollegeStudentReport 
          data={data} 
          variant={report.reportType === 'detailed' ? 'detailed' : 'standard'}
          includeAcademicPlanning={true}
          showInternshipGuide={true}
        />;
      case 'working_professional':
        return <ProfessionalReport 
          data={data}
          variant={report.reportType === 'detailed' ? 'executive' : 'standard'}
          includeLeadershipAnalysis={true}
          showTransitionPlanning={true}
        />;
      default:
        return <CollegeStudentReport 
          data={data} 
          variant="standard"
          includeAcademicPlanning={true}
          showInternshipGuide={true}
        />;
    }
  };

  return (
    <div className="assessment-type-report">
      {renderReportByType()}
    </div>
  );
}
