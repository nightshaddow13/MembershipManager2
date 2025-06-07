import Calendar, { Event } from "@/components/Calendar";
import Layout from "@/components/Layout";

const sampleEvents: Event[] = [
	{ id: "1", datetime: "2025-06-10T09:00:00-04:00", title: "Meeting with Bob" },
	{ id: "2", datetime: "2025-06-10T12:30:00-04:00", title: "Lunch with Alice" },
	{ id: "3", datetime: "2025-06-11T17:00:00-04:00", title: "Project deadline" },
	{ id: "4", datetime: "2025-06-12T10:00:00-04:00", title: "Call with client" },
	{ id: "5", datetime: "2025-06-12T09:00:00-04:00", title: "Team standup" },
	{
		id: "6",
		datetime: "2025-06-15T15:00:00-04:00",
		title: "Doctor appointment",
	},
];

const Index = () => {
	const handleAddEvent = (date: Date) => {
		// Navigate to external page for adding event, pass date as query param
	};

	const handleEditEvent = (event: Event) => {
		// Navigate to external page for editing event by id
	};

	return (
		<Layout title="React SPA with Vite + TypeScript">
			<div className="mt-5">
				<Calendar
					events={sampleEvents}
					onAddEvent={handleAddEvent}
					onEditEvent={handleEditEvent}
					className="max-w-5xl mx-auto"
				/>
			</div>
		</Layout>
	);
};

export default Index;
