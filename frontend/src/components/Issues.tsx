import React, {useState} from "react";
import {toast} from "sonner";
import {useUser} from "@/components/providers/UserProvider.tsx";
import {Dialog, DialogContent, DialogHeader, DialogTrigger} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Field, FieldGroup, FieldLabel, FieldSeparator, FieldSet} from "@/components/ui/field.tsx";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";

function Issues() {
    const [page, setPage] = useState<string | undefined>("");
    const [type, setType] = useState<string | undefined>("");
    const [issue, setIssue] = useState<string | undefined>("");
    const {user} = useUser();



    const username = user?.username;

    const handleIssue = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch("http://localhost:8080/api/create-issue", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({page, type, issue, username})
        });

        if (type === "positive") {
            toast.success("Thank you!")
        }

        if (!res.ok) {
            toast.error("Issue Submit Failed");
            return
        }

        setIssue("")
        setPage("")
        setType("")
    }

    return (
        <Dialog>
                <FieldGroup>
                    <DialogTrigger>
                        <Button>Issues</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>Submit your issues</DialogHeader>
                        <FieldSet>
                            <Field>
                                <FieldLabel>
                                    Pages
                                </FieldLabel>
                                <Select defaultValue={""} onValueChange={setPage} value={page}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={"Select a page"}/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Pages</SelectLabel>
                                            <SelectItem value="home">Home</SelectItem>
                                            <SelectItem value="rule">Rules</SelectItem>
                                            <SelectItem value="standings">Player Standing</SelectItem>
                                            <SelectItem value="login">Login</SelectItem>
                                            <SelectItem value="signup">Signup</SelectItem>
                                            <SelectItem value="profile">Profile</SelectItem>
                                            <SelectItem value="game">Game</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </Field>
                            <Field>
                                <FieldLabel>
                                    Type
                                </FieldLabel>
                                <Select defaultValue={""} onValueChange={setType} value={type}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={"Select a page"}/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Type</SelectLabel>
                                            <SelectItem value="bug">Bug</SelectItem>
                                            <SelectItem value="enhancement">Enhancement</SelectItem>
                                            <SelectItem value="positive">Positive Feedback</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </Field>
                        </FieldSet>
                        <FieldSeparator/>
                        <FieldSet>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="issue">
                                        Issue
                                    </FieldLabel>
                                    <Textarea
                                        id="issue"
                                        placeholder="Add your comments"
                                        className="resize-none"
                                        value={issue}
                                        onChange={(e) => setIssue(e.target.value)}
                                    />
                                </Field>
                            </FieldGroup>
                        </FieldSet>
                        <Field orientation="horizontal">
                            <Button type="submit" onClick={handleIssue}>Submit</Button>
                        </Field>
                    </DialogContent>
                </FieldGroup>
        </Dialog>
    );
}

export default Issues;