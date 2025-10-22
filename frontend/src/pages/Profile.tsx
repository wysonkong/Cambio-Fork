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
import Avatar from "@/components/player/avatar.tsx";
import { useUser} from "@/components/providers/UserProvider.tsx";

export default function Profile() {
    // @ts-ignore
    const {user} = useUser();




    return (

            <div className={"h-screen flex items-center"}>
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
                        <Avatar/>
                    </CardAction>
                </Card>}
            </div>




    )

}
