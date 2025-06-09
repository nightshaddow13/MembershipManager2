import Calendar, { Event as CalendarEvent } from "@/components/Calendar";
import Layout from "@/components/Layout";
import { QueryEvent, Event } from "@/dtos";
import { useClient } from "@/gateway";
import { useEffect, useState } from "react";

const Index = () => {
	const client = useClient();

	const [events, setEvents] = useState<CalendarEvent[]>([]);
	useEffect(() => {
		(async () => await refreshEvents())();
	}, []);

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

	const handleAddEvent = async (date: Date) => {
		await refreshEvents();
		// Navigate to external page for adding event, pass date as query param
	};

	const handleEditEvent = async (event: CalendarEvent) => {
		await refreshEvents();
		// Navigate to external page for editing event by id
	};

	return (
		<Layout title="React SPA with Vite + TypeScript">
			<div className="mt-5">
				<Calendar
					events={events}
					onAddEvent={handleAddEvent}
					onEditEvent={handleEditEvent}
					className="max-w-5xl mx-auto"
				/>
			</div>
		</Layout>
	);
};

export default Index;
