import { classNames } from "../utils/style";
import { forwardRef, HTMLProps } from "react";

type SelectProps = HTMLProps<HTMLSelectElement>;

const Select = forwardRef<HTMLSelectElement, SelectProps>(({ className, ...props }, ref) => (
    <select
        {...props}
        ref={ref}
        className={classNames(
            "mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md",
            className
        )}
    />
));

export default Select;
