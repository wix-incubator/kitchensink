import React from 'react';
import { cn } from '@/lib/utils';
import { Choice as ChoicePrimitive } from '@wix/headless-stores/react';

export const Choice = ChoicePrimitive.Root;

export const ChoiceText = React.forwardRef<
  React.ElementRef<typeof ChoicePrimitive.Text>,
  React.ComponentPropsWithoutRef<typeof ChoicePrimitive.Text>
>((props, ref) => {
  return (
    <ChoicePrimitive.Text
      {...props}
      ref={ref}
      className={cn(
        'data-[selected="false"]:text-content-primary border-surface-subtle hover:bg-primary/10',
        props.className
      )}
    >
      {props.children}
    </ChoicePrimitive.Text>
  );
});

ChoiceText.displayName = 'ChoiceText';

export const ChoiceColor = React.forwardRef<
  React.ElementRef<typeof ChoicePrimitive.Color>,
  React.ComponentPropsWithoutRef<typeof ChoicePrimitive.Color>
>((props, ref) => {
  return (
    <ChoicePrimitive.Color
      {...props}
      ref={ref}
      className={cn(
        "w-10 h-10 rounded-full border-4 transition-all duration-200 border-color-swatch hover:border-color-swatch-hover hover:scale-105 data-[selected='true']:border-brand-primary data-[selected='true']:shadow-lg data-[selected='true']:scale-110 data-[selected='true']:ring-2 data-[selected='true']:ring-brand-primary/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale",
        props.className
      )}
    >
      {props.children}
    </ChoicePrimitive.Color>
  );
});

ChoiceColor.displayName = 'ChoiceColor';

export const ChoiceFreeText = React.forwardRef<
  React.ElementRef<typeof ChoicePrimitive.FreeText>,
  React.ComponentPropsWithoutRef<typeof ChoicePrimitive.FreeText>
>((props, ref) => {
  return (
    <ChoicePrimitive.FreeText
      {...props}
      ref={ref}
      className={cn(
        'p-3 border-brand-light bg-surface-primary text-content-primary placeholder:text-content-subtle focus-visible:border-brand-medium resize-none',
        props.className
      )}
    >
      {props.children}
    </ChoicePrimitive.FreeText>
  );
});

ChoiceFreeText.displayName = 'ChoiceFreeText';
