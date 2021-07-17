import { classNames } from "../utils/style";
import { forwardRef, HTMLProps } from "react";

type InputProps = HTMLProps<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => (
    <input
        ref={ref}
        {...props}
        className={classNames("shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md", className)}
    />
));

export default Input;
