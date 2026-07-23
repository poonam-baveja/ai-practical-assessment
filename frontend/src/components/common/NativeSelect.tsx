import { forwardRef } from 'react';

interface NativeSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** Makes the select take full width of its container */
  fullWidth?: boolean;
}

/**
 * Reusable native <select> with consistent styling.
 * Uses forwardRef for React Hook Form compatibility.
 */
export const NativeSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(
  ({ fullWidth = true, style, ...props }, ref) => {
    return (
      <select
        ref={ref}
        style={{
          width: fullWidth ? '100%' : undefined,
          padding: '8px 12px',
          borderRadius: '6px',
          border: '1px solid #E2E8F0',
          fontSize: '14px',
          backgroundColor: 'white',
          ...style,
        }}
        {...props}
      />
    );
  }
);

NativeSelect.displayName = 'NativeSelect';
