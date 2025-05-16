import { useEffect, useState } from "react";
import Page from "@/components/LayoutPage";
import { ValidateAuth } from "@/useAuth";

import { Unit, QueryUnits, District } from "@/dtos";
import { useClient } from "@/gateway";
import DataTable, { columnDefs, getCoreRowModel } from "@/components/DataTable";

function Index() {

    const client = useClient();
    const [newUnit, SetNewUnit] = useState<boolean>(false)
    const [units, setUnits] = useState<Unit[]>([])
    useEffect(() => {
        (async () => await refreshUnits())()
    }, [])

    const columns = columnDefs(['district', 'type', 'sex', 'number'],
        ({ district }) => {
            district.cell = ({getValue}) => <>{(getValue() as District).description}</>
    })

    const refreshUnits = async () => {
        const api = await client.api(new QueryUnits())
        if (api.succeeded) {
            setUnits(api.response!.results ?? [])
        }
    }

    return(<Page title="Unit Management">
        <DataTable columns={columns} data={units} getCoreRowModel={getCoreRowModel()} />
    </Page>)
}

export default ValidateAuth(Index, { role: 'NewMemberCoordinator'})