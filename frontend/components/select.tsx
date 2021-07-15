import { classNames } from "../utils/style";

function Select({ className, ...props }) {
    return (
        <select
            className={classNames(
                "mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md",
                className
            )}
            {...props}
        ></select>
    );
}

export default Select;
