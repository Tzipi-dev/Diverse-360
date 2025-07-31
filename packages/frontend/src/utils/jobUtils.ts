export const truncateText = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const getTimeAgo = (date: Date): string => {
  const now = new Date();
  const jobDate = new Date(date);
  const diffInDays = Math.floor((now.getTime() - jobDate.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'היום';
  if (diffInDays === 1) return 'אתמול';
  if (diffInDays < 7) return `לפני ${diffInDays} ימים`;
  return `לפני ${Math.floor(diffInDays / 7)} שבועות`;
};

export const validatePDFFile = (file: File): boolean => {
  return file.type === 'application/pdf';
};

