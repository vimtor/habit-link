import { forwardRef, MouseEventHandler, ReactNode } from "react";
import Link, { LinkProps } from "next/link";

interface WrapperProps {
    children: ReactNode;
    href?: string;
    onClick?: MouseEventHandler;
}

const Wrapper = forwardRef<HTMLAnchorElement, WrapperProps>(({ children, href, onClick }, ref) => (
    <a ref={ref} href={href} onClick={onClick} className="button">
        {children}
    </a>
));

const LinkContainer = ({ children, ...props }: LinkProps & { children: ReactNode }) => {
    return (
        <Link {...props} passHref>
            <Wrapper>{children}</Wrapper>
        </Link>
    );
};

export default LinkContainer;
