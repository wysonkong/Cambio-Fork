import Navbar from "./components/Navbar.tsx";
import type {PropsWithChildren} from "react";

const Layout = ({ children } : PropsWithChildren) => {
    return (
        <div className={"bg-cover bg-center relative flex min-h-svh flex-col"} style={{
            backgroundImage: "url('/images/background-spooky.png')",
        }}>
            <Navbar />
            <main className={"pt-16"}>{children}</main>
        </div>
    );
};

export default Layout;
