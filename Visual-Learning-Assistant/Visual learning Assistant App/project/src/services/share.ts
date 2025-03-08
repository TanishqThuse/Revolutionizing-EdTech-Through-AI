import { jsPDF } from 'jspdf';

export async function generatePDF(problem: string, solution: string): Promise<void> {
  try {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Problem Solution', 20, 20);
    
    // Add problem
    doc.setFontSize(14);
    doc.text('Problem:', 20, 40);
    doc.setFontSize(12);
    const problemLines = doc.splitTextToSize(problem, 170);
    doc.text(problemLines, 20, 50);
    
    // Add solution
    doc.setFontSize(14);
    doc.text('Solution:', 20, 70);
    doc.setFontSize(12);
    
    // Split solution into lines that fit the page width
    const lines = doc.splitTextToSize(solution, 170);
    doc.text(lines, 20, 80);
    
    // Save the PDF
    doc.save('solution.pdf');
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
}

export async function shareSolution(problem: string, solution: string): Promise<void> {
  try {
    // First try using the Web Share API
    if (navigator.share && navigator.canShare) {
      const shareData = {
        title: 'Problem Solution',
        text: `Problem: ${problem}\n\nSolution: ${solution}`,
      };

      if (navigator.canShare(shareData)) {
        await navigator.share(shareData);
        return;
      }
    }

    // Fallback to clipboard
    await navigator.clipboard.writeText(`Problem: ${problem}\n\nSolution: ${solution}`);
    alert('Solution copied to clipboard!');
  } catch (error) {
    // Only throw if it's not an AbortError (user canceling the share)
    if (error instanceof Error && error.name !== 'AbortError') {
      console.error('Error sharing:', error);
      throw new Error('Failed to share solution');
    }
  }
}