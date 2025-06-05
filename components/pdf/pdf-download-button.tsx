'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import generateCareerReportPDF from './pdf-generator';

interface PDFDownloadButtonProps {
  reportData: {
    user: any;
    scores: {
      aptitude: Record<string, any>;
      personality: Record<string, number>;
      interest: Record<string, number>;
    };
    careerMatches: any[];
    sessionId: string;
    targetAudience?: string;
    reportType?: string;
    [key: string]: any; // Allow additional props
  };
  filename?: string;
  variant?: 'default' | 'secondary' | 'outline';
  className?: string;
  children?: React.ReactNode;
}

export function PDFDownloadButton({
  reportData,
  filename,
  variant = 'default',
  className = '',
  children
}: PDFDownloadButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      setError(null);

      // Validate required data
      if (!reportData.sessionId) {
        throw new Error('Session ID is required');
      }

      // Ensure careerMatches is an array
      const validCareerMatches = Array.isArray(reportData.careerMatches) ? reportData.careerMatches : [];

      // Prepare data for PDF generation
      const pdfData = {
        user: {
          name: reportData.user?.name || 'Student',
          email: reportData.user?.email || '',
          age: reportData.user?.age,
          gradeLevel: reportData.user?.gradeLevel,
          schoolName: reportData.user?.schoolName
        },
        scores: reportData.scores || {
          aptitude: {},
          personality: {},
          interest: {}
        },
        careerMatches: validCareerMatches,
        sessionId: reportData.sessionId,
        targetAudience: reportData.targetAudience || 'college_student',
        reportType: reportData.reportType || 'standard',
        recommendations: [
          'Explore your top career matches in detail',
          'Build relevant skills through courses and experience',
          'Network with professionals in your field of interest',
          'Consider informational interviews in your areas of interest',
          'Develop a strategic plan for your career development'
        ]
      };

      console.log('Generating PDF client-side for:', reportData.targetAudience);

      // Generate PDF using jsPDF - this now returns a jsPDF instance
      const pdf = generateCareerReportPDF(pdfData);
      
      // Generate filename
      const fileName = filename || `career-report-${pdfData.user.name?.replace(/\s+/g, '-') || 'student'}-${new Date().toISOString().split('T')[0]}.pdf`;
      
      // Save the PDF
      pdf.save(fileName);

    } catch (error) {
      console.error('PDF generation failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to create report');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="relative">
      <Button
        onClick={handleDownload}
        disabled={isGenerating}
        variant={variant}
        className={`${className} ${isGenerating ? 'opacity-75' : ''}`}
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Download className="w-4 h-4 mr-2" />
            {children || 'Download Report'}
          </>
        )}
      </Button>
      
      {error && (
        <div className="absolute top-full left-0 mt-2 p-2 bg-red-100 border border-red-300 rounded text-sm text-red-700 z-10 min-w-max">
          {error}
        </div>
      )}
    </div>
  );
}
