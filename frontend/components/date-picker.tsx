import { forwardRef, HTMLProps } from "react";
import { CalendarIcon } from "@heroicons/react/solid";
import Input from "./input";

type DatePickerProps = HTMLProps<HTMLInputElement>;

const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(({ className, ...props }, ref) => (
    <div className="relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <CalendarIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        {/* @ts-ignore */}
        <Input ref={ref} {...props} className={`pl-10 ${className}`} type="date" />
    </div>
));

export default DatePicker;
