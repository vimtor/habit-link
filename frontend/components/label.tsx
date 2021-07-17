import { classNames } from "../utils/style";
import { HTMLProps } from "react";

type LabelProps = HTMLProps<HTMLLabelElement>;

const Label = ({ children, className, ...props }: LabelProps) => (
    <label {...props} className={classNames("block text-sm text-left font-medium text-gray-700 mb-1", className)}>
        {children}
    </label>
);

export default Label;
