export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${Math.round(seconds)}s`;
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes < 60) {
    if (remainingSeconds === 0) {
      return `${minutes}m`;
    }
    return `${minutes}m ${Math.round(remainingSeconds)}s`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}

export function formatDurationShort(seconds: number): string {
  if (seconds < 60) {
    return `${Math.round(seconds)}s`;
  }
  
  const minutes = Math.round(seconds / 60);
  return `${minutes}m`;
}

export function estimateTimeFromQuestions(questionCount: number, section: string): number {
  const timePerQuestion = {
    aptitude: 60,      // 1 minute per aptitude question
    personality: 30,   // 30 seconds per personality question  
    interest: 30       // 30 seconds per interest question
  };
  
  return questionCount * (timePerQuestion[section as keyof typeof timePerQuestion] || 45);
}

export function formatTimeMinutes(totalSeconds: number): string {
  if (!totalSeconds || totalSeconds <= 0) return '0m';
  
  const minutes = Math.round(totalSeconds / 60);
  if (minutes < 60) {
    return `${minutes}m`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${remainingMinutes}m`;
}
