import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import {Button} from "@/components/ui/button.tsx";

export type Standing = {
    id: string
    username: string
    wins: number
    loses: number
    rank?: number
}

function calculateRank(id: string, data: Standing[]): number {
    const sorted = [...data].sort((a, b) => {
        const totalA = a.wins + a.loses
        const totalB = b.wins + b.loses
        const aPct = totalA > 0 ? a.wins / totalA : 0
        const bPct = totalB > 0 ? b.wins / totalB : 0

        if (bPct !== aPct) return bPct - aPct
        if (totalB !== totalA) return totalB - totalA
        return a.username.localeCompare(b.username)
    })

    return sorted.findIndex((player) => player.id === id) + 1
}

export const createdColumns = (data: Standing[]): ColumnDef<Standing>[] => [
    {
        id: "rank",
        header: ({column}) => {
            return (
                <Button variant={"ghost"} onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Rank
                    <ArrowUpDown className={"ml-2 h-4 w-4"}/>
                </Button>
            )
        },
        accessorFn: (row) => calculateRank(row.id, data),
        cell: ({ getValue }) => {
            const rank = getValue<number>()
            const medal = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : ""
            return (
                <div className="font-bold">
                    {medal} {rank}
                </div>
            )
        },
        enableSorting: true,
        sortingFn: "basic",
    },
    {
        accessorKey: "username",
        header: "Username",
    },
    {
        accessorKey: "wins",
        header: "Wins",
    },
    {
        accessorKey: "loses",
        header: "Losses",
    },
    {
        id: "percentage",
        header: "Win Rate",
        accessorFn: (row) => {
            const total = row.wins + row.loses
            return total > 0 ? (row.wins / total) * 100 : 0
        },
        cell: ({ getValue }) => `${getValue<number>().toFixed(1)} %`,
        enableSorting: true,
    },
]
