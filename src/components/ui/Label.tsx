/**
 * The Label module provides a pre-styled label component based on @radix-ui/react-label and https://ui.shadcn.com/docs/primitives/label
 */

import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';

import { cn } from '@/src/lib/utils';

/**
 * The Label component is a pre-styled label element based on @radix-ui/react-label.
 * It extends the base LabelPrimitive.Root component with additional styling.
 * @param props - Props for the Label component.
 * @returns A Label React element.
 */
const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      className
    )}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
