import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {Button} from "@/components/ui/button.tsx";
import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "@/components/providers/AuthProvider.tsx";
import {toast} from "sonner";

const Signup = () => {
    const {login} = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [feedback, setFeedback] = useState("");
    const [isValid, setIsValid] = useState(false);
    const navigate = useNavigate();

    const validateForm = async () => {
        if (!username.trim()) {
            setFeedback("");
            setIsValid(false);
            return;
        } else {
            try {
                const res = await fetch(
                    `http://localhost:8080/api/findUser?username=${encodeURIComponent(username)}`
                );
                const data = await res.json();

                if (data.exists) {
                    setFeedback("Username is taken");
                    setIsValid(false);
                } else {
                    setFeedback("Username is available");
                }
            } catch (err) {
                console.error("Error checking username", err);
                setFeedback("Error checking username");
                setIsValid(false);
            }
        }

        setIsValid(true)
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid) return;

        try {
            const response = await fetch("http://localhost:8080/api/new_user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username,
                    password,
                }),
            });

            if (!response.ok) {
                console.log("Sign up failed");
                return;
            }

            console.log("Successfully signed up");
            toast("Successfully signed up", {className: "bg-card text-card-foreground border-border"})
            setUsername("");
            setPassword("");
            setFeedback("Sign up successful!");

            const loginRes = await fetch("http://localhost:8080/api/user", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({username, password}),
            });

            if (!loginRes.ok) {
                console.error("Login failed");
                return
            }

            const data = await loginRes.json();
            login(data.sessionId, data.userId);
            console.log("Successfully logged in");
            console.log("Session ID: ", data.sessionId);
            console.log("User ID: ", data.userId);
            navigate("/");

        } catch (err) {
            console.error("Error signing up", err);
        }
    }

    useEffect(() => {
        validateForm();
    }, [username]);

    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <div className="w-full max-w-md bg-card p-6 rounded-lg">
                <h2 className="text-2xl text-card-foreground font-bold text-center mb-6">Create an Account</h2>
                <form onSubmit={handleSubmit}>
                    <FieldSet className={""}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="username" className={"text-card-foreground"}>Username</FieldLabel>
                                <Input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="newuser123"
                                    className={"text-card-foreground"}
                                />
                                <FieldDescription>
                                    {feedback}
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
                                    className={"text-card-foreground"}
                                />
                                <FieldDescription>
                                    Must be at least 8 characters long.
                                </FieldDescription>
                            </Field>
                            <Field orientation="horizontal">
                                <Button type="submit" disabled={!isValid} className={"bg-accent text-accent-foreground"}>Submit</Button>
                                <Button variant="outline" type="reset" className={"bg-foreground text-background"}>Reset</Button>
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                </form>
            </div>
        </div>
    );
};

export default Signup;