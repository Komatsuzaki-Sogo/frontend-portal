import { forwardRef } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

const commonSectionVariants = tv({
  slots: {
    base: 'grid w-full gap-x-4 md:gap-x-8',
    content: 'col-start-2 col-end-3 reset-margin',
  },
  variants: {
    fullHeight: {
      true: {
        base: 'h-full',
        content: 'h-full',
      },
      false: {
        base: '',
        content: '',
      },
    },
    width: {
      default: {
        base: 'grid-cols-[1fr_minmax(270px,var(--CONTENT_WIDTH))_1fr]',
      },
      narrow: {
        base: 'grid-cols-[1fr_minmax(270px,var(--CONTENT_WIDTH_NARROW))_1fr]',
      },
    },
    py: {
      default: { content: 'py-6 md:py-8' },
      xs: { content: 'py-2 md:py-2' },
      sm: { content: 'py-4 md:py-6' },
      lg: { content: 'py-8 md:py-10' },
      none: { content: 'py-0' },
    },
  },
  defaultVariants: {
    fullHeight: false,
    width: 'default',
    py: 'default',
  },
});

export interface CommonSectionProps
  extends
    React.ComponentPropsWithoutRef<'div'>,
    VariantProps<typeof commonSectionVariants> {}

export const CommonSection = forwardRef<HTMLDivElement, CommonSectionProps>(
  ({ children, py, fullHeight, width, className, ...props }, ref) => {
    const { base, content } = commonSectionVariants({
      fullHeight,
      width,
      py,
    });

    return (
      <div className={base({ className })} ref={ref} {...props}>
        <div className={content()}>{children}</div>
      </div>
    );
  },
);

CommonSection.displayName = 'CommonSection';
