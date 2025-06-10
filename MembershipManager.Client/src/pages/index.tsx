import Calendar, { Event as CalendarEvent } from "@/components/Calendar";
import CreateSidebar from "@/components/CreateSidebar";
import Layout from "@/components/Layout";
import { QueryEvent, CreateEvent, EventType, State } from "@/dtos";
import { useApp, useClient } from "@/gateway";
import { FormInput, InputType } from "@/types";
import { ValidateAuth } from "@/useAuth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
	const client = useClient();
	const app = useApp();
	const navigate = useNavigate();

	const [newEvent, setNewEvent] = useState<boolean>(false);
	const [events, setEvents] = useState<CalendarEvent[]>([]);
	useEffect(() => {
		(async () => await refreshEvents())();
	}, []);

	const reset = (args: { newEvent?: boolean; editEventId?: number } = {}) => {
		setNewEvent(args.newEvent ?? false);
	};

	const onDone = async () => reset();
	const onSave = async () => {
		onDone();
		await refreshEvents();
	};

	const refreshEvents = async () => {
		const api = await client.api(new QueryEvent({}));
		if (api.succeeded) {
			const events = api.response!.results ?? [];
			const mappedEvents: CalendarEvent[] = events.map((event) => ({
				id: `${event.id}`,
				datetime: event.dateTime,
				title: event.description,
			}));
			setEvents(mappedEvents);
		}
	};

	const handleAddEvent = async () => {
		setNewEvent(true);
		await refreshEvents();
		// Navigate to external page for adding event, pass date as query param
	};

	const handleEditEvent = async (event: CalendarEvent) => {
		navigate(`/events/event/${event.id}`);
	};

	const createInputs: FormInput[] = [
		{
			type: InputType.Select,
			id: "eventType",
			options: app.enumOptions("EventType"),
			value: (dto: CreateEvent) => {
				return dto.eventType;
			},
			onChange: (dto: CreateEvent, value: string) => {
				dto.eventType = value as EventType;
			},
		},
		{
			type: InputType.TextInput,
			id: "description",
			value: (dto: CreateEvent) => {
				return dto.description;
			},
			onChange: (dto: CreateEvent, value: string) => {
				dto.description = value as string;
			},
		},
		{
			type: InputType.DateTime,
			id: "dateTime",
			value: (dto: CreateEvent) => {
				return dto.dateTime;
			},
			onChange: (dto: CreateEvent, value: string) => {
				dto.dateTime = value as string;
			},
		},
		{
			type: InputType.TextInput,
			id: "address",
			value: (dto: CreateEvent) => {
				return dto.address;
			},
			onChange: (dto: CreateEvent, value: string) => {
				dto.address = value as string;
			},
		},
		{
			type: InputType.TextInput,
			id: "city",
			value: (dto: CreateEvent) => {
				return dto.city;
			},
			onChange: (dto: CreateEvent, value: string) => {
				dto.city = value as string;
			},
		},
		{
			type: InputType.Select,
			id: "state",
			options: app.enumOptions("State"),
			value: (dto: CreateEvent) => {
				return dto.state;
			},
			onChange: (dto: CreateEvent, value: string) => {
				dto.state = value as State;
			},
		},
		{
			type: InputType.TextInput,
			id: "zipCode",
			value: (dto: CreateEvent) => {
				return dto.zipCode;
			},
			onChange: (dto: CreateEvent, value: string) => {
				dto.zipCode = value as string;
			},
		},
	];

	return (
		<Layout title="Membership Manager - Events">
			<div className="mt-5">
				<Calendar
					events={events}
					onAddEvent={handleAddEvent}
					onEditEvent={handleEditEvent}
					className="max-w-5xl mx-auto"
				/>
				<CreateSidebar
					typeName="Events"
					open={newEvent}
					inputs={createInputs}
					onDone={onDone}
					onSave={onSave}
					instance={() => new CreateEvent()}
					create={(request: any) => new CreateEvent(request)}
				/>
			</div>
		</Layout>
	);
};

export default ValidateAuth(Index, { role: "NewMemberCoordinator" });
