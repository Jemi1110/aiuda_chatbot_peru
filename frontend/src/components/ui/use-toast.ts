// Simple toast implementation that logs to console
const toast = ({
  title,
  description,
  variant = 'default',
}: {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}): string => {
  // Log to console with styling for visibility
  const style = variant === 'destructive' ? 'color: red;' : 'color: blue;';
  console.log(`%c${title}`, `${style} font-weight: bold;`);
  if (description) {
    console.log(`%c${description}`, style);
  }
  
  // Return a mock toast ID
  return Math.random().toString(36).substring(2, 9);
};

export { toast }
