import Navbar from "./components/Navbar.tsx";
import type {PropsWithChildren} from "react";
import {Toaster} from "sonner";
import Issues from "@/components/Issues.tsx";

const Layout = ({ children } : PropsWithChildren) => {
    return (
        <div className={"bg-cover bg-center relative flex min-h-svh flex-col"} style={{
            backgroundImage: "url('/images/christmas-bg.gif')",
        }}>
            <Navbar />
            <main className={"pt-16"}>{children}</main>
            <Toaster/>
        </div>
    );
};

export default Layout;
