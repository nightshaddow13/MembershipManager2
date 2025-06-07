import Calendar, { Event } from "@/components/Calendar";
import Layout from "@/components/Layout";

const sampleEvents: Event[] = [
	{ id: "1", date: "2025-06-10", title: "Meeting with Bob" },
	{ id: "2", date: "2025-06-10", title: "Lunch with Alice" },
	{ id: "3", date: "2025-06-11", title: "Project deadline" },
	{ id: "4", date: "2025-06-12", title: "Call with client" },
	{ id: "5", date: "2025-06-12", title: "Team standup" },
	{ id: "6", date: "2025-06-15", title: "Doctor appointment" },
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
