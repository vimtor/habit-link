import { Children, cloneElement, isValidElement, MouseEventHandler, ReactNode } from "react";
import { classNames } from "../utils/style";

interface ButtonGroupProps {
    children: ReactNode;
}

interface ButtonGroupOptionProps {
    children: ReactNode;
    className?: string;
    onClick?: MouseEventHandler;
}

function ButtonGroup({ children }: ButtonGroupProps) {
    const count = Children.count(children) - 1;
    return (
        <span className="relative z-0 mt-4 w-full inline-flex shadow-sm rounded-md">
            {Children.map(children, (child, index) => {
                if (isValidElement(child)) {
                    return cloneElement(child, {
                        className: classNames(
                            index === 0 ? null : `-ml-px`,
                            index === 0 ? `rounded-l-md` : null,
                            index === count ? `rounded-r-md` : null,
                            child.props.className
                        ),
                    });
                }
            })}
        </span>
    );
}

ButtonGroup.Option = function ButtonGroupOption({ children, className, onClick }: ButtonGroupOptionProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={classNames(
                className,
                "relative w-full text-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            )}
        >
            {children}
        </button>
    );
};

export default ButtonGroup;
