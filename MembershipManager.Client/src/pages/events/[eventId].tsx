import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CreateEventNote, Event, Note, QueryEvent } from "@/dtos";
import { useClient } from "@/gateway";
import { Card } from "@/components/ui/card";
import NotesList from "@/components/NotesList";

const EventPage = () => {
	const client = useClient();
	const eventId = parseInt(useParams().eventId ?? "");

	const [event, setEvent] = useState<Event>();
	useEffect(() => {
		(async () => await queryEvent())();
	}, []);

	const queryEvent = async () => {
		const api = await client.api(new QueryEvent({ id: eventId }));
		if (api.succeeded) {
			const event = api.response!.results?.[0] ?? [];
			setEvent(event);
		}
	};

	const createNote = async (newNoteId: number) => {
		await client.api(
			new CreateEventNote({ noteId: newNoteId, eventId: eventId })
			// todo: add success logic here to set note ids on success
		);
	};

	function formatDateTimeOffset(datetimeOffset: string) {
		if (!datetimeOffset) return { date: "TBD", time: "TBD" };

		// Parse the DateTimeOffset string into a Date object
		const dateObj = new Date(datetimeOffset);

		// Extract date string in a readable format
		const date = dateObj.toLocaleDateString(undefined, {
			year: "numeric",
			month: "long",
			day: "numeric",
		});

		// Extract time string in HH:mm format
		const time = dateObj.toLocaleTimeString(undefined, {
			hour: "2-digit",
			minute: "2-digit",
		});

		return { date, time };
	}

	function splitPascalCase(str: string) {
		return str.replace(/([A-Z])/g, " $1").trim();
	}

	return (
		<Layout
			title={`MM - ${event?.description} ${splitPascalCase(
				event?.eventType ?? ""
			)}`}
		>
			<div className="flex flex-col items-center mt-5 space-y-6">
				<h1 className="text-2xl font-bold text-center">
					{event?.description} {splitPascalCase(event?.eventType ?? "")}
				</h1>

				{/* Container for side-by-side cards */}
				<div className="flex flex-col md:flex-row md:space-x-6 mx-auto max-w-6xl w-full px-4">
					{/* Event Info Card */}
					<Card className="flex-1 p-6 bg-white dark:bg-gray-800 mb-6 md:mb-0">
						<div className="flex space-x-8 text-lg justify-center">
							<div className="flex flex-col items-center">
								<span className="font-semibold">Date:</span>
								<span>
									{formatDateTimeOffset(event?.dateTime ?? "").date || "TBD"}
								</span>
							</div>
							<div className="flex flex-col items-center">
								<span className="font-semibold">Time:</span>
								<span>
									{formatDateTimeOffset(event?.dateTime ?? "").time || "TBD"}
								</span>
							</div>
						</div>

						{/* Address Section */}
						<div className="text-center text-lg mt-4">
							<span className="font-semibold">Address:</span>
							<p>
								{event?.address}, {event?.city}, {event?.state} {event?.zipCode}
							</p>
						</div>
					</Card>

					{/* Notes List Card */}
					<div className="flex-1">
						<NotesList
							onCreate={createNote}
							noteIds={event?.notesLink.map((note) => note.noteId) ?? []}
						/>
					</div>
				</div>
			</div>
		</Layout>
	);
};

export default EventPage;
