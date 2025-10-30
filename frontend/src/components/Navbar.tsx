import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"
import {Link} from "react-router"
import {useNavigate} from "react-router-dom";
import {useAuth} from "@/components/providers/AuthProvider.tsx";
import logo from "/images/logo.png";
import {useUser} from "@/components/providers/UserProvider.tsx";
import {Button} from "@/components/ui/button.tsx";

const Navbar = () => {
    const {isLoggedIn, logout} = useAuth();
    const {user} = useUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    }

    return (
        <NavigationMenu
            className={"fixed top-0 left-0 w-full backdrop-blur-md shadow-md z-50 rounded-b-lg bg-primary justify-between"}
        >
            <NavigationMenuList className={"flex items-center justify-between px-8 py-3 w-full"}>
                <NavigationMenuItem>
                    <img src={logo} alt={"Cambio logo"} className={"h-14 w-14"} onClick={() => navigate("/")}/>
                </NavigationMenuItem>
            </NavigationMenuList>

            <NavigationMenuList
                className={"flex items-center justify-between px-8 py-3 text-primary-foreground w-full"}>
                <div className={"ml-auto flex items-center space-x-4"}>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild>
                            <Button
                                onClick={() => navigate("/Rules")}
                                className={"px-3 py-2 rounded-md hover:bg-secondary hover:text-secondary-foreground transition-colors"}
                            >
                                Rules
                            </Button>
                        </NavigationMenuLink>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <NavigationMenuLink asChild>
                            <Button
                                onClick={() => navigate("/Standings")}
                                className={"px-3 py-2 rounded-md hover:bg-secondary hover:text-secondary-foreground transition-colors"}
                            >
                                Player Standings
                            </Button>
                        </NavigationMenuLink>
                    </NavigationMenuItem>

                    {isLoggedIn ? (
                            <>
                                <NavigationMenuItem>
                                    <NavigationMenuLink asChild>
                                        <Button
                                            onClick={() => navigate("/JoinGame")}
                                            className={"px-3 py-2 rounded-md hover:bg-secondary hover:text-secondary-foreground transition-colors"}
                                        >
                                            Join Game
                                        </Button>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavigationMenuLink asChild>
                                        <Button
                                            onClick={handleLogout}
                                            className={"px-3 py-2 rounded-md hover:bg-secondary hover:text-secondary-foreground transition-colors"}
                                        >
                                            Log Out
                                        </Button>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavigationMenuLink asChild>
                                        <Button
                                            onClick={() => navigate("/Profile")}
                                            className={"px-3 py-2 rounded-md hover:bg-secondary hover:text-secondary-foreground transition-colors"}
                                        >
                                            {isLoggedIn && user ? (<img src={`/images/avatars/${user.avatar}.png`} alt={user.avatar} className={"h-14 w-14"}/>) : (<div>Profile</div>)}
                                        </Button>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            </>
                        ) :
                        (
                            <><NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link
                                        to={"/Login"}
                                        className={"px-3 py-2 rounded-md hover:bg-secondary hover:text-secondary-foreground transition-colors"}
                                    >
                                        Log In
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem><NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link
                                        to={"/Signup"}
                                        className={"px-3 py-2 rounded-md bg-accent font-semibold hover:bg-secondary hover:text-secondary-foreground transition-colors"}
                                    >
                                        Sign Up
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem></>
                        )}


                </div>
            </NavigationMenuList>
        </NavigationMenu>
    );
};


export default Navbar;