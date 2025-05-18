import { useEffect, useState } from "react";
import Page from "@/components/LayoutPage";
import { useAuth, ValidateAuth } from "@/useAuth";

import Create from "./Create"
import Edit from "./Edit"
import { Unit, QueryUnits, District } from "@/dtos";
import { useClient } from "@/gateway";
import { DataTable, columnDefs, getCoreRowModel } from "@/components/DataTable";
import { Button } from "@/components/ui/button"

function Index() {

    const client = useClient();
    const { hasRole } = useAuth()
    const [newUnit, setNewUnit] = useState<boolean>(false)
    const [units, setUnits] = useState<Unit[]>([])
    useEffect(() => {
        (async () => await refreshUnits())()
    }, [])

    const columns = columnDefs(['district', 'sex', 'type', 'number'],
        ({ district }) => {
            district.cell = ({getValue}) => <>{(getValue() as District).description}</>
    })

    const reset = (args: { newUnit?: boolean, editUnitId?: number } = {}) => {
        setNewUnit(args.newUnit ?? false)
        setRowSelection({})
    }

    const onDone = async () => reset()
    const onSave = async () => {
        onDone()
        await refreshUnits()
    }

    const refreshUnits = async () => {
        const api = await client.api(new QueryUnits())
        if (api.succeeded) {
            setUnits(api.response!.results ?? [])
        }
    }
    const [rowSelection, setRowSelection] = useState({})
    const selectedIndex = parseInt(Object.keys(rowSelection)[0])
    const selectedRow = !isNaN(selectedIndex)
        ? units[selectedIndex]
        : null

    return(<Page title="Unit Management">
        <div className="mt-4 flex flex-col">
            {!hasRole('MembershipChair') ? null :                          
                <div className="my-2">
                    <Button variant="outline" onClick={() => setNewUnit(true)}>New Unit</Button>
                </div>}
            <DataTable columns={columns} data={units} getCoreRowModel={getCoreRowModel()} state={{rowSelection}}
                       enableRowSelection={true} enableMultiRowSelection={false}
                       onRowSelectionChange={setRowSelection} />
            <Create open={newUnit} onDone={onDone} onSave={onSave} />
            <Edit id={selectedRow?.id} onDone={onDone} onSave={onSave} />
        </div>
    </Page>)
}

export default ValidateAuth(Index, { role: 'NewMemberCoordinator'})