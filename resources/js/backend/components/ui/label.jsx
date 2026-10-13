import * as LabelPrimitive from '@radix-ui/react-label';

import { cn } from '@/backend/lib/utils';

function Label({ className, ...props }) {
    return (
        <LabelPrimitive.Root
            className={cn('text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70', className)}
            {...props}
        />
    );
}

export { Label };