import {Field, FieldDescription, FieldGroup, FieldLabel, FieldSet} from "@/components/ui/field.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useNavigate} from "react-router-dom";
import {useAuth} from "@/components/providers/AuthProvider.tsx";
import {useState} from "react";

const Login = () => {
    const {login} = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch("http://localhost:8080/api/user", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username, password}),
        });

        if (!res.ok) {
            console.error("Login failed");
            return
        }

        const data = await res.json();
        login(data.sessionId, data.user);
        console.log("Successfully logged in " + data.userId);
        console.log("Session ID: ", data.sessionId);
        navigate("/");
    }

    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <div className="w-full max-w-md bg-card p-6 rounded-lg">
                <h2 className="text-2xl text-card-foreground font-bold text-center mb-6">Log In To Your Account</h2>
                <form onSubmit={handleLogin}>
                    <FieldSet className={""}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="username" className={"text-card-foreground"}>Username</FieldLabel>
                                <Input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="user123"
                                    className={"text-card-foreground"}/>
                                <FieldDescription>
                                    Enter your username for your account.
                                </FieldDescription>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="password" className={"text-card-foreground"}>Password</FieldLabel>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="********"
                                    className={"text-card-foreground"}/>
                                <FieldDescription>
                                    Enter your password.
                                </FieldDescription>
                            </Field>
                            <Field orientation="horizontal">
                                <Button type="submit" className={"bg-accent text-accent-foreground"}>Submit</Button>
                                <Button variant="outline" type="button"
                                        className={"bg-foreground text-background"}>Cancel</Button>
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                </form>
            </div>
        </div>
    );
};

export default Login;