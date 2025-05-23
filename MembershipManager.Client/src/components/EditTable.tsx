import { useEffect, useState } from "react";
import { useAuth } from "@/useAuth";

import { QueryResponse, IReturn, IdResponse, IReturnVoid } from "@/dtos";
import { useClient } from "@/gateway.ts";
import { DataTable, getCoreRowModel } from "@/components/DataTable";
import { Button } from "@/components/ui/button"
import CreateSidebar from "@/components/CreateSidebar";
import { FormInput } from "@/types";
import EditSidebar from "@/components/EditSidebar";
import { ColumnDef } from "@tanstack/react-table";

type Props<TThing> = {
    createRole: string
    columns: ColumnDef<unknown>[]
    createInputs: FormInput[]
    editInputs: FormInput[]
    createInstance: () => IReturn<IdResponse>
    editInstance: () => IReturn<IdResponse>
    query: (dto: Partial<any>) => IReturn<QueryResponse<any>>
    create: (request: any) => IReturn<IdResponse>
    update: (dto: Partial<any>) => IReturn<IdResponse>
    delete_: (dto: Partial<any>) => IReturnVoid
    getId: (dto: TThing | null) => number | undefined
}

function EditTable<TThing>({createRole, columns, createInputs, editInputs, createInstance, editInstance, query, create, update, delete_, getId}: Props<TThing>) {

    const client = useClient();
    
    const { hasRole } = useAuth()
    const [newThing, setNewThing] = useState<boolean>(false)
    const [thing, setThings] = useState<TThing[]>([])
    useEffect(() => {
        (async () => await refreshThings())()
    }, [])

    const reset = (args: { newThing?: boolean, editThingId?: number } = {}) => {
        setNewThing(args.newThing ?? false)
        setRowSelection({})
    }

    const onDone = async () => reset()
    const onSave = async () => {
        onDone()
        await refreshThings()
    }

    const refreshThings = async () => {
        const api = await client.api(query({}))
        if (api.succeeded) {
            setThings(api.response!.results ?? [])
        }
    }
    const [rowSelection, setRowSelection] = useState({})
    const selectedIndex = parseInt(Object.keys(rowSelection)[0])
    const selectedRow = !isNaN(selectedIndex)
        ? thing[selectedIndex]
        : null

    return(
        <div className="mt-4 flex flex-col">
            {!hasRole(createRole) ? null :                          
                <div className="my-2">
                    <Button variant="outline" onClick={() => setNewThing(true)}>New Unit</Button>
                </div>}
            <DataTable columns={columns} data={thing} getCoreRowModel={getCoreRowModel()} state={{rowSelection}}
                       enableRowSelection={true} enableMultiRowSelection={false}
                       onRowSelectionChange={setRowSelection} />
            <CreateSidebar 
                typeName="Unit" 
                open={newThing}
                inputs={createInputs} 
                onDone={onDone} 
                onSave={onSave}
                instance={createInstance}
                create={create} />
            <EditSidebar 
                typeName="Unit" 
                id = {getId(selectedRow)}
                inputs={editInputs} 
                onDone={onDone} 
                onSave={onSave}
                instance={editInstance}
                query={query}
                update={update}
                delete_={delete_} />
        </div>)
}

export default EditTable