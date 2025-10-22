import { useEffect, useState } from "react";
import { DataTable } from "@/components/player/data-table";
import { createdColumns} from "@/components/player/columns";
import type {User} from "@/components/Interfaces.tsx";

export default function Standings() {
    const [data, setData] = useState<User[]>([]);
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
