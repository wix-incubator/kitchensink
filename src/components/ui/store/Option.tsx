import React from 'react';
import { cn } from '@/lib/utils';
import { Option as OptionPrimitive } from '@wix/headless-stores/react';

export const Option = OptionPrimitive.Root;

export const OptionName = React.forwardRef<
  React.ElementRef<typeof OptionPrimitive.Name>,
  React.ComponentPropsWithoutRef<typeof OptionPrimitive.Name>
>((props, ref) => {
  return (
    <OptionPrimitive.Name
      {...props}
      ref={ref}
      className={cn(
        'text-md font-medium text-content-primary',
        props.className
      )}
    >
      {props.children}
    </OptionPrimitive.Name>
  );
});

OptionName.displayName = 'OptionName';

export const OptionMandatoryIndicator = React.forwardRef<
  React.ElementRef<typeof OptionPrimitive.MandatoryIndicator>,
  React.ComponentPropsWithoutRef<typeof OptionPrimitive.MandatoryIndicator>
>((props, ref) => {
  return (
    <OptionPrimitive.MandatoryIndicator
      {...props}
      ref={ref}
      className={cn('text-status-error ml-1', props.className)}
    >
      {props.children}
    </OptionPrimitive.MandatoryIndicator>
  );
});

OptionMandatoryIndicator.displayName = 'OptionMandatoryIndicator';

export const OptionChoices = React.forwardRef<
  React.ElementRef<typeof OptionPrimitive.Choices>,
  React.ComponentPropsWithoutRef<typeof OptionPrimitive.Choices>
>((props, ref) => {
  return (
    <OptionPrimitive.Choices {...props} ref={ref}>
      {props.children}
    </OptionPrimitive.Choices>
  );
});

OptionChoices.displayName = 'OptionChoices';

export const OptionChoiceRepeater = OptionPrimitive.ChoiceRepeater;

OptionChoiceRepeater.displayName = 'OptionChoiceRepeater';
