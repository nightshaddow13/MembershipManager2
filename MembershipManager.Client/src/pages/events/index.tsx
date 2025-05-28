import Page from "@/components/LayoutPage";
import { ValidateAuth } from "@/useAuth";

import { Event, QueryEvent, CreateEvent, UpdateEvent, DeleteEvent, EventType, State, GradeLevels } from "@/dtos";
import { useApp } from "@/gateway.ts";
import { columnDefs } from "@/components/DataTable";
import { FormInput, InputType } from "@/types";
import EditTable from "@/components/EditTable";

function Index() {
    const app = useApp()

    const columns = columnDefs(['description', 'eventType', 'dateTime', 'address', 'city', 'state', 'zipCode'])

    const createInputs: FormInput[] = [
        {
            type: InputType.Select,
            id: "eventType",
            options: (app.enumOptions('EventType')),
            value: (dto: CreateEvent) => {return dto.eventType},
            onChange: (dto: CreateEvent, value: string) => {dto.eventType = value as EventType;}
        },
        {
            type: InputType.TextInput,
            id: "description",
            value: (dto: CreateEvent) => {return dto.description},
            onChange: (dto: CreateEvent, value: string) => {dto.description = value as string;}
        },
        {
            type: InputType.DateTime,
            id: "dateTime",
            value: (dto: CreateEvent) => {return dto.dateTime},
            onChange: (dto: CreateEvent, value: string) => {dto.dateTime = value as string;}
        },
        {
            type: InputType.TextInput,
            id: "address",
            value: (dto: CreateEvent) => {return dto.address},
            onChange: (dto: CreateEvent, value: string) => {dto.address = value as string;}
        },
        {
            type: InputType.TextInput,
            id: "city",
            value: (dto: CreateEvent) => {return dto.city},
            onChange: (dto: CreateEvent, value: string) => {dto.city = value as string;}
        },
        {
            type: InputType.Select,
            id: "state",
            options: (app.enumOptions('State')),
            value: (dto: CreateEvent) => {return dto.state},
            onChange: (dto: CreateEvent, value: string) => {dto.state = value as State;}
        },
        {
            type: InputType.TextInput,
            id: "zipCode",
            value: (dto: CreateEvent) => {return dto.zipCode},
            onChange: (dto: CreateEvent, value: string) => {dto.zipCode = value as string;}
        }
    ]
    const editInputs: FormInput[] = [
        {
            type: InputType.Select,
            id: "eventType",
            options: (app.enumOptions('EventType')),
            value: (dto: CreateEvent) => {return dto.eventType},
            onChange: (dto: CreateEvent, value: string) => {dto.eventType = value as EventType;}
        },
        {
            type: InputType.TextInput,
            id: "description",
            value: (dto: CreateEvent) => {return dto.description},
            onChange: (dto: CreateEvent, value: string) => {dto.description = value as string;}
        },
        {
            type: InputType.DateTime,
            id: "dateTime",
            value: (dto: CreateEvent) => {return dto.dateTime},
            onChange: (dto: CreateEvent, value: string) => {dto.dateTime = value as string;}
        },
        {
            type: InputType.TextInput,
            id: "address",
            value: (dto: CreateEvent) => {return dto.address},
            onChange: (dto: CreateEvent, value: string) => {dto.address = value as string;}
        },
        {
            type: InputType.TextInput,
            id: "city",
            value: (dto: CreateEvent) => {return dto.city},
            onChange: (dto: CreateEvent, value: string) => {dto.city = value as string;}
        },
        {
            type: InputType.Select,
            id: "state",
            options: (app.enumOptions('State')),
            value: (dto: CreateEvent) => {return dto.state},
            onChange: (dto: CreateEvent, value: string) => {dto.state = value as State;}
        },
        {
            type: InputType.TextInput,
            id: "zipCode",
            value: (dto: CreateEvent) => {return dto.zipCode},
            onChange: (dto: CreateEvent, value: string) => {dto.zipCode = value as string;}
        }
    ]

    const createInstance = () => new CreateEvent()
    const editInstance = () => new UpdateEvent()
    const create= (request: any) => new CreateEvent(request)
    const query = (dto: Partial<QueryEvent>) => new QueryEvent(dto)
    const update = (dto: Partial<UpdateEvent>) => new UpdateEvent(dto)
    const delete_ = (dto: Partial<DeleteEvent>) => new DeleteEvent(dto)
    const getId = (dto: Event | null) => dto?.id

    return(<Page title="Event Management">
        <div className="mt-4 flex flex-col">
            <EditTable<Event> 
                createRole='MembershipChair'
                typeName="Event"
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