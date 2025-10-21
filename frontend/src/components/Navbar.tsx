import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"
import {Link} from "react-router"
// import {useNavigate} from "react-router-dom";
// import {useAuth} from "@/components/AuthProvider.tsx";

const Navbar = () => {
    //const {isLoggedIn, logout} = useAuth();
    //const navigate = useNavigate();

    // const handleLogout = () => {
    //     logout();
    //     navigate("/");
    // }

    return (
        <NavigationMenu
            className={"fixed top-0 left-0 w-full backdrop-blur-md shadow-md z-50 rounded-b-lg bg-primary justify-between"}
        >
            <NavigationMenuList className={"flex items-center justify-between px-8 py-3 w-full"}>
                <NavigationMenuItem>
                    <Link to={"/"}
                          className={"text-xl font-bold text-primary-foreground hover:text-blue-400 transition-colors"}>Cambio</Link>
                </NavigationMenuItem>
            </NavigationMenuList>

            <NavigationMenuList className={"flex items-center justify-between px-8 py-3 text-primary-foreground w-full"}>
                <div className={"ml-auto flex items-center space-x-4"}>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild>
                            <Link
                                to={"/Rules"}
                                className={"px-3 py-2 rounded-md hover:bg-secondary hover:text-secondary-foreground transition-colors"}
                            >
                                Rules
                            </Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <NavigationMenuLink asChild>
                            <Link
                                to={"#"}
                                className={"px-3 py-2 rounded-md hover:bg-secondary hover:text-secondary-foreground transition-colors"}
                            >
                                Player Standings
                            </Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <NavigationMenuLink asChild>
                            <Link
                                to="#"
                                className={"px-3 py-2 rounded-md hover:bg-secondary hover:text-secondary-foreground transition-colors"}
                            >
                                Join Game
                            </Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <NavigationMenuLink asChild>
                            <Link
                                to="#"
                                //onClick={handleLogout}
                                className={"px-3 py-2 rounded-md hover:bg-secondary hover:text-secondary-foreground transition-colors"}
                            >
                                Log Out
                            </Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>


                    <NavigationMenuItem>
                        <NavigationMenuLink asChild>
                            <Link
                                to={"/Login"}
                                className={"px-3 py-2 rounded-md hover:bg-secondary hover:text-secondary-foreground transition-colors"}
                            >
                                Log In
                            </Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <NavigationMenuLink asChild>
                            <Link
                                to={"/Signup"}
                                className={"px-3 py-2 rounded-md bg-accent font-semibold hover:bg-secondary hover:text-secondary-foreground transition-colors"}
                            >
                                Sign Up
                            </Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>


                </div>
            </NavigationMenuList>
        </NavigationMenu>
    );
};


export default Navbar;