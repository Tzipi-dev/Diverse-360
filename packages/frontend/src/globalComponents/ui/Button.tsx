import  React from 'react';
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-2xl bg-primary px-4 py-2 text-white text-sm font-medium shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none',
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
export { Button };
export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}






