
import type {User} from "@/components/Interfaces.tsx"
import {useEffect, useState} from "react";
import {
    Card,
    CardAction,
    CardContent,
    CardHeader,
    CardTitle
}from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {Button} from "@/components/ui/button.tsx";


export default function Profile() {
    const [user, setUser] = useState<User | null>(null);


    useEffect(() => {
        const sessionId = localStorage.getItem("sessionId");
        fetch("http://localhost:8080/api/me", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "X-Session-Id": sessionId || "",
                }
            })
            .then(res => res.json())
            .then(setUser)
            .catch(console.error);
    }, [])



    return (

            <>
                {user && <Card>
                    <CardHeader>
                        <CardTitle>{user.username}</CardTitle>
                    </CardHeader>
                    <img src={`/images/avatars/${user.avatar}.png`} height={200} width={200}/>
                    <CardContent>
                        <Table>
                            <TableCaption>Player Record</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Wins</TableHead>
                                    <TableHead>Losses</TableHead>
                                    <TableHead>Win Percentage</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableCell>{user.wins}</TableCell>
                                <TableCell>{user.loses}</TableCell>
                                <TableCell>{user.wins / (user.loses + user.wins)}</TableCell>
                            </TableBody>
                        </Table>
                    </CardContent>
                    <CardAction>
                        <Button variant="link">Change Avatar</Button>
                    </CardAction>
                </Card>}

            </>




    )

}
