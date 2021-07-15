import { forwardRef } from "react";
import Link, { LinkProps } from "next/link";

const Wrapper = forwardRef(({ children, href, onClick }, ref) => (
    <a ref={ref} href={href} onClick={onClick} className="button">
        {children}
    </a>
));

const LinkContainer = ({ children, ...props }: LinkProps) => {
    return (
        <Link {...props} passHref>
            <Wrapper>{children}</Wrapper>
        </Link>
    );
};

export default LinkContainer;
