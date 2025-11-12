import {Card, CardAction, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import Avatar from "@/components/player/avatar.tsx";
import {useUser} from "@/components/providers/UserProvider.tsx";
import CardThemes from "@/components/player/CardThemes.tsx";

export default function Profile() {
    const {user} = useUser();


    return (

        <div className={"h-screen flex items-center"}>
            {user && <Card
                className="overflow-hidden rounded-md border bg-foreground text-background w-1/3 mx-auto margin flex items-center">
                <CardHeader className={"flex justify-center"}><CardTitle>{user.username}</CardTitle>
                </CardHeader>
                <img src={`/images/avatars/${user.avatar}.png`} height={200} width={200} alt={`${user.avatar}`}/>
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
                    <span className={"text-bold justify-center"}>Balance: <span className={"text-green-700"}>{user.balance}</span></span>

                </CardContent>
                <CardAction>
                    <div className={"flex flex-col"}>
                        <div className={"flex gap-2"}>
                        <Avatar/>
                        <CardThemes/>
                        </div>
                    </div>
                </CardAction>
            </Card>}
        </div>


    )

}
