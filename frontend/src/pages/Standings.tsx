import { useEffect, useState } from "react";
import { DataTable } from "@/components/playerStandings/data-table";
import { createdColumns, type Standing } from "@/components/playerStandings/columns";

export default function Standings() {
    const [data, setData] = useState<Standing[]>([]);
    const columns = createdColumns(data)

    useEffect(() => {
        async function fetchData() {
            const result = [
                {id: "1", username: "Test", wins: 4, losses: 1},
                {id: "2", username: "Admin", wins: 2, losses: 1},
                {id: "3", username: "Yes", wins: 2, losses: 1},
                {id: "4", username: "OMG", wins: 3, losses: 2},
                {id: "5", username: "Weird", wins: 5, losses: 1},
            ];
            setData(result);
        }

        fetchData();
    }, []);

    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={data} />
        </div>
    );
}
