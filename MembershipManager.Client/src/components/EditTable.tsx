import { useEffect, useState } from "react";
import Page from "@/components/LayoutPage";
import { useAuth } from "@/useAuth";

import { Unit, QueryUnits, District, CreateUnit, Sex, UnitType, UpdateUnit, IdResponse, IReturn, DeleteUnit } from "@/dtos";
import { useApp, useClient } from "@/gateway.ts";
import { DataTable, columnDefs, getCoreRowModel } from "@/components/DataTable";
import { Button } from "@/components/ui/button"
import CreateSidebar from "@/components/CreateSidebar";
import { EditSidebarOptions, CreateSidebarOptions, FormInput, InputType } from "@/types";
import EditSidebar from "@/components/EditSidebar";

function EditTable() {
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
    const createOptions: CreateSidebarOptions = {
        visibleFields: "district,sex,type,number",
        typeName: "Unit",
        createInstance: () => new CreateUnit({
                districtId: 1
            }),
        createDto: (request) => new CreateUnit(request),
        inputs: createInputs
    }

    const editInputs: FormInput[] = [
            {
                type: InputType.Select,
                id: "sex",
                options: (app.enumOptions('Sex')),
                value: (dto: UpdateUnit) => {return dto.sex},
                onChange: (dto: UpdateUnit, value: string) => {dto.sex = value as Sex;}
            }
        ]
    const editOptions: EditSidebarOptions = {
        visibleFields: "sex",
        typeName: "Unit",
        createInstance: () => new UpdateUnit(),
        query: (dto: Partial<QueryUnits>) => new QueryUnits(dto),
        update: (dto: Partial<UpdateUnit>) => new UpdateUnit(dto),
        delete: (dto: Partial<DeleteUnit>) => new DeleteUnit(dto),
        inputs: editInputs
    }

    return(<Page title="Unit Management">
        <div className="mt-4 flex flex-col">
            {!hasRole('MembershipChair') ? null :                          
                <div className="my-2">
                    <Button variant="outline" onClick={() => setNewUnit(true)}>New Unit</Button>
                </div>}
            <DataTable columns={columns} data={units} getCoreRowModel={getCoreRowModel()} state={{rowSelection}}
                       enableRowSelection={true} enableMultiRowSelection={false}
                       onRowSelectionChange={setRowSelection} />
            <CreateSidebar options={createOptions} open={newUnit} onDone={onDone} onSave={onSave} />
            <EditSidebar options={editOptions} id={selectedRow?.id} onDone={onDone} onSave={onSave} />
        </div>
    </Page>)
}

export default EditTable