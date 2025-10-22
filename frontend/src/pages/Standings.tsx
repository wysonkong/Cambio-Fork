import { useEffect, useState } from "react";
import { DataTable } from "@/components/playerStandings/data-table";
import { createdColumns, type Standing } from "@/components/playerStandings/columns";

export default function Standings() {
    const [data, setData] = useState<Standing[]>([]);
    const columns = createdColumns(data)

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch("http://localhost:8080/api/standings");
                const items = await response.json();
                setData(items);
            } catch (err) {
                console.error("Error fetching items:", err);
            }
        }

        fetchData();
    }, []);

    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={data} />
        </div>
    );
}
