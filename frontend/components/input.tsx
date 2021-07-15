import { classNames } from "../utils/style";

const Input = ({ className, ...props }) => (
    <input
        {...props}
        className={classNames("shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md", className)}
    />
);

export default Input;
