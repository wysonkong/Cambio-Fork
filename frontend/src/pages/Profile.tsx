
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
        const userId = localStorage.getItem("userId");
        async function fetchProfile() {
            try {
                const response = await fetch("http://localhost:8080/api/getUser" + userId, {
                    method: "GET",
                    });
                const item = await response.json();
                setUser(item);
            } catch (err) {
                console.error("Error fetching items:", err);
            }
        }

        fetchProfile();
    }, []);



    return (

            <><div className={"h-screen flex items-center"}>
                {user && <Card className="overflow-hidden rounded-md border bg-foreground text-background w-1/3 mx-auto margin flex items-center">
                    <CardHeader className={"flex justify-center"}><CardTitle>{user.username}</CardTitle>
                    </CardHeader>
                    <img src={`/images/avatars/${user.avatar}.png`} height={200} width={200}/>
                    <CardContent>
                        <Table className={"bg-foreground text-background"}>
                            <TableCaption>Player Record</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Wins</TableHead>
                                    <TableHead>Losses</TableHead>
                                    <TableHead>Win Percentage</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>{user.wins}</TableCell>
                                    <TableCell>{user.loses}</TableCell>
                                    <TableCell>
                                        {user.wins + user.loses === 0
                                            ? 0
                                            : ((user.wins / (user.wins + user.loses)) * 100).toFixed(2) + "%"}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                    <CardAction>
                        <Button variant="link">Change Avatar</Button>
                    </CardAction>
                </Card>}</div>

            </>




    )

}
