import Page from "@/components/LayoutPage";
import { ValidateAuth } from "@/useAuth";

import { Unit, QueryUnits, District, CreateUnit, Sex, UnitType, UpdateUnit, DeleteUnit } from "@/dtos";
import { useApp } from "@/gateway.ts";
import { columnDefs } from "@/components/DataTable";
import { FormInput, InputType } from "@/types";
import EditTable from "@/components/EditTable";

function Index() {
    const app = useApp()

    const columns = columnDefs(['district', 'sex', 'type', 'number'],
        ({ district }) => {
            district.cell = ({getValue}) => <>{(getValue() as District).description}</>
    })

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
    const editInputs: FormInput[] = [
        {
            type: InputType.Select,
            id: "sex",
            options: (app.enumOptions('Sex')),
            value: (dto: UpdateUnit) => {return dto.sex},
            onChange: (dto: UpdateUnit, value: string) => {dto.sex = value as Sex;}
        }
    ]

    const createInstance = () => new CreateUnit({ districtId: 1 })
    const editInstance = () => new UpdateUnit()
    const create= (request: any) => new CreateUnit(request)
    const query = (dto: Partial<QueryUnits>) => new QueryUnits(dto)
    const update = (dto: Partial<UpdateUnit>) => new UpdateUnit(dto)
    const delete_ = (dto: Partial<DeleteUnit>) => new DeleteUnit(dto)
    const getId = (dto: Unit | null) => dto?.id

    return(<Page title="Unit Management">
        <div className="mt-4 flex flex-col">
            <EditTable<Unit> 
                createRole='MembershipChair'
                typeName="Unit"
                columns={columns}
                createInputs={createInputs}
                editInputs={editInputs}
                createInstance={createInstance}
                editInstance={editInstance}
                query={query}
                create={create}
                update={update}
                delete_={delete_}
                getId={getId} />
        </div>
    </Page>)
}

export default ValidateAuth(Index, { role: 'NewMemberCoordinator'})