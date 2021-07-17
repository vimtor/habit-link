import Head from "next/head";
import { ReactNode } from "react";
import Navbar from "./navbar";

type LayoutProps = {
    children: ReactNode;
    title: string;
};

function Layout({ children, title }: LayoutProps) {
    return (
        <div className="bg-gray-100 h-screen">
            <Head>
                <title>{title} | Habit Link</title>
                <link rel="icon" href="/favicon.ico" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800" rel="stylesheet" />
            </Head>
            <main>{children}</main>
        </div>
    );
}

export default Layout;
