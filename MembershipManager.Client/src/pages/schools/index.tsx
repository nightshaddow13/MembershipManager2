import Page from "@/components/LayoutPage";
import { ValidateAuth } from "@/useAuth";

import { School, QuerySchool, CreateSchool, UpdateSchool, DeleteSchool, SchoolType, State, GradeLevels } from "@/dtos";
import { useApp } from "@/gateway.ts";
import { columnDefs } from "@/components/DataTable";
import { FormInput, InputType } from "@/types";
import EditTable from "@/components/EditTable";

function Index() {
    const app = useApp()

    const columns = columnDefs(['description', 'schoolType', 'gradeLevels', 'address', 'city', 'state', 'zipCode'])

    const createInputs: FormInput[] = [
        {
            type: InputType.TextInput,
            id: "description",
            value: (dto: CreateSchool) => {return dto.description},
            onChange: (dto: CreateSchool, value: string) => {dto.description = value as string;}
        },
        {
            type: InputType.Select,
            id: "schoolType",
            options: (app.enumOptions('SchoolType')),
            value: (dto: CreateSchool) => {return dto.schoolType},
            onChange: (dto: CreateSchool, value: string) => {dto.schoolType = value as SchoolType;}
        },
        {
            type: InputType.Select,
            id: "gradeLevels",
            options: (app.enumOptions('GradeLevels')),
            value: (dto: CreateSchool) => {return dto.gradeLevels},
            onChange: (dto: CreateSchool, value: string) => {dto.gradeLevels = value as GradeLevels;}
        },
        {
            type: InputType.TextInput,
            id: "address",
            value: (dto: CreateSchool) => {return dto.address},
            onChange: (dto: CreateSchool, value: string) => {dto.address = value as string;}
        },
        {
            type: InputType.TextInput,
            id: "city",
            value: (dto: CreateSchool) => {return dto.city},
            onChange: (dto: CreateSchool, value: string) => {dto.city = value as string;}
        },
        {
            type: InputType.Select,
            id: "state",
            options: (app.enumOptions('State')),
            value: (dto: CreateSchool) => {return dto.state},
            onChange: (dto: CreateSchool, value: string) => {dto.state = value as State;}
        },
        {
            type: InputType.TextInput,
            id: "zipCode",
            value: (dto: CreateSchool) => {return dto.zipCode},
            onChange: (dto: CreateSchool, value: string) => {dto.zipCode = value as string;}
        }
    ]
    const editInputs: FormInput[] = [
        {
            type: InputType.TextInput,
            id: "description",
            value: (dto: CreateSchool) => {return dto.description},
            onChange: (dto: CreateSchool, value: string) => {dto.description = value as string;}
        },
        {
            type: InputType.Select,
            id: "schoolType",
            options: (app.enumOptions('SchoolType')),
            value: (dto: CreateSchool) => {return dto.schoolType},
            onChange: (dto: CreateSchool, value: string) => {dto.schoolType = value as SchoolType;}
        },
        {
            type: InputType.Select,
            id: "gradeLevels",
            options: (app.enumOptions('GradeLevels')),
            value: (dto: CreateSchool) => {return dto.gradeLevels},
            onChange: (dto: CreateSchool, value: string) => {dto.gradeLevels = value as GradeLevels;}
        },
        {
            type: InputType.TextInput,
            id: "address",
            value: (dto: CreateSchool) => {return dto.address},
            onChange: (dto: CreateSchool, value: string) => {dto.address = value as string;}
        },
        {
            type: InputType.TextInput,
            id: "city",
            value: (dto: CreateSchool) => {return dto.city},
            onChange: (dto: CreateSchool, value: string) => {dto.city = value as string;}
        },
        {
            type: InputType.TextInput,
            id: "zipCode",
            value: (dto: CreateSchool) => {return dto.zipCode},
            onChange: (dto: CreateSchool, value: string) => {dto.zipCode = value as string;}
        }
    ]

    const createInstance = () => new CreateSchool()
    const editInstance = () => new UpdateSchool()
    const create= (request: any) => new CreateSchool(request)
    const query = (dto: Partial<QuerySchool>) => new QuerySchool(dto)
    const update = (dto: Partial<UpdateSchool>) => new UpdateSchool(dto)
    const delete_ = (dto: Partial<DeleteSchool>) => new DeleteSchool(dto)
    const getId = (dto: School | null) => dto?.id

    return(<Page title="School Management">
        <div className="mt-4 flex flex-col">
            <EditTable<School> 
                createRole='MembershipChair'
                typeName="School"
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