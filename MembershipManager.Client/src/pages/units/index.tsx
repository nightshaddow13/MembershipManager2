import { useEffect, useState } from "react";
import Page from "@/components/LayoutPage";
import { useAuth, ValidateAuth } from "@/useAuth";

import Create from "./Create"
import Edit from "./Edit"
import { Unit, QueryUnits, District, CreateUnit, Sex, UnitType, UpdateUnit, IdResponse, IReturn, DeleteUnit } from "@/dtos";
import { useApp, useClient } from "@/gateway.ts";
import { DataTable, columnDefs, getCoreRowModel } from "@/components/DataTable";
import { Button } from "@/components/ui/button"
import CreateSidebar from "@/components/CreateSidebar";
import { EditSidebarOptions, CreateSidebarOptions, FormInput, InputType } from "@/types";
import EditSidebar from "@/components/EditSidebar";
import EditTable from "@/components/EditTable";

function Index() {
    const app = useApp()
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

    const createInputs: FormInput[] = [
            {
                type: InputType.Select,
                id: "sex",
                options: (app.enumOptions('Sex')),
                value: (dto: CreateUnit) => {return dto.sex},
                onChange: (dto: CreateUnit, value: string) => {dto.sex = value as Sex;}
            },
            {
                type: InputType.Select,
                id: "type",
                options: (app.enumOptions('UnitType')),
                value: (dto: CreateUnit) => {return dto.type},
                onChange: (dto: CreateUnit, value: string) => {dto.type = value as UnitType;}
            },
            {
                type: InputType.NumberInput,
                id: "number",
                value: (dto: CreateUnit) => {return dto.number},
                min: 0,
                required: true,
                onChange: (dto: CreateUnit, value: string) => {dto.number = Number(value);}
            }
        ]
    const createInstance = () => new CreateUnit({ districtId: 1 })
    const editInstance = () => new UpdateUnit()
    const create= (request: any) => new CreateUnit(request)
    const query = (dto: Partial<QueryUnits>) => new QueryUnits(dto)
    const update = (dto: Partial<UpdateUnit>) => new UpdateUnit(dto)
    const delete_ = (dto: Partial<DeleteUnit>) => new DeleteUnit(dto)

    const editInputs: FormInput[] = [
            {
                type: InputType.Select,
                id: "sex",
                options: (app.enumOptions('Sex')),
                value: (dto: UpdateUnit) => {return dto.sex},
                onChange: (dto: UpdateUnit, value: string) => {dto.sex = value as Sex;}
            }
        ]

    return(<Page title="Unit Management">
        <div className="mt-4 flex flex-col">
            {!hasRole('MembershipChair') ? null :                          
                <div className="my-2">
                    <Button variant="outline" onClick={() => setNewUnit(true)}>New Unit</Button>
                </div>}
            <DataTable columns={columns} data={units} getCoreRowModel={getCoreRowModel()} state={{rowSelection}}
                       enableRowSelection={true} enableMultiRowSelection={false}
                       onRowSelectionChange={setRowSelection} />
            <CreateSidebar 
                visibleFields="district,sex,type,number" 
                typeName="Unit" 
                open={newUnit}
                inputs={createInputs} 
                onDone={onDone} 
                onSave={onSave}
                instance={createInstance}
                create={create} />
            <EditSidebar 
                visibleFields="sex"
                typeName="Unit" 
                id={selectedRow?.id}
                inputs={editInputs} 
                onDone={onDone} 
                onSave={onSave}
                instance={editInstance}
                query={query}
                update={update}
                delete_={delete_} />
        </div>
        <div>
            
        </div>
    </Page>)
}

export default ValidateAuth(Index, { role: 'NewMemberCoordinator'})