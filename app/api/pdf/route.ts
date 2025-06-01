import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { generateProfessionalPDF } from '@/components/pdf/pdf-generator';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { reportId } = await request.json();

    if (!reportId) {
      return NextResponse.json({ error: 'Report ID is required' }, { status: 400 });
    }

    // Get the report by ID
    const report = await prisma.report.findUnique({
      where: { id: reportId },
      include: { user: true }
    });

    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    // Verify user owns this report
    if (report.user.email !== session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Use your existing PDF generator
    await generateProfessionalPDF(
      report,
      report.user.name || 'Student',
      () => console.log('PDF generation started'),
      () => console.log('PDF generation completed'),
      (error) => console.error('PDF generation error:', error)
    );

    // Since your generateProfessionalPDF directly triggers download,
    // we return a success response
    return NextResponse.json({ 
      success: true, 
      message: 'PDF generated successfully' 
    });

  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
