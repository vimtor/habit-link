import { classNames } from "../utils/style";

const Label = ({ children, className, ...props }) => (
    <label {...props} className={classNames("block text-sm text-left font-medium text-gray-700 mb-1", className)}>
        {children}
    </label>
);

export default Label;
