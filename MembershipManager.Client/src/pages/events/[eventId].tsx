import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CreateEventNote, Event, QueryEvent } from "@/dtos";
import { useClient } from "@/gateway";
import { Card } from "@/components/ui/card";
import NotesList from "@/components/NotesList";

const checklistProperties = [
	{ key: "isConfirmedBySchool", label: "Confirmed By School" },
	{ key: "isConfirmedByUnit", label: "Confirmed By Unit" },
	{ key: "needsHalfSheetFlyers", label: "Needs Half Sheet Flyers" },
	{ key: "areHalfSheetFlyersOrdered", label: "Half Sheet Flyers Ordered" },
	{ key: "areHalfSheetFlyersDelivered", label: "Half Sheet Flyers Delivered" },
	{ key: "needsFullSheetFlyers", label: "Needs Full Sheet Flyers" },
	{ key: "areFullSheetFlyersOrdered", label: "Full Sheet Flyers Ordered" },
	{ key: "areFullSheetFlyersDelivered", label: "Full Sheet Flyers Delivered" },
	{ key: "requiresFacilitron", label: "Requires Facilitron" },
	{ key: "isFacilitronConfirmed", label: "Facilitron Confirmed" },
];

const EventPage = () => {
	const client = useClient();
	const eventId = parseInt(useParams().eventId ?? "");
	const [noteIds, setNoteIds] = useState<number[]>([]);
	const [event, setEvent] = useState<Event>();

	useEffect(() => {
		(async () => await queryEvent())();
	}, []);

	const queryEvent = async () => {
		const api = await client.api(new QueryEvent({ id: eventId }));
		if (api.succeeded) {
			const event = api.response!.results?.[0] ?? [];
			setEvent(event);
			setNoteIds(event?.notesLink.map((note) => note.noteId) ?? []);
		} else {
			console.error("Failed to get event");
		}
	};

	const createNote = async (newNoteId: number) => {
		const api = await client.api(
			new CreateEventNote({ noteId: newNoteId, eventId: eventId })
		);
		if (api.succeeded) {
			setNoteIds(noteIds.concat(newNoteId));
		} else {
			console.error("Failed to link note to event");
		}
	};

	function formatDateTimeOffset(datetimeOffset: string) {
		if (!datetimeOffset) return { date: "TBD", time: "TBD" };

		const dateObj = new Date(datetimeOffset);

		const date = dateObj.toLocaleDateString(undefined, {
			year: "numeric",
			month: "long",
			day: "numeric",
		});

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

				{/* Container for side-by-side cards with notes spanning vertically */}
				<div className="flex flex-col md:flex-row md:space-x-6 mx-auto max-w-6xl w-full px-4">
					{/* Left side: checklist and event info stacked vertically */}
					<div className="flex flex-col md:flex-col md:w-1/3 space-y-6">
						{/* Event Info Card */}
						<Card className="bg-white dark:bg-gray-800 p-6">
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
									{event?.address}, {event?.city}, {event?.state}{" "}
									{event?.zipCode}
								</p>
							</div>
						</Card>

						{/* Checklist Card */}
						<Card className="bg-white dark:bg-gray-800 p-6">
							<h2 className="text-xl font-semibold mb-4 text-center">
								Checklist
							</h2>
							<div className="flex flex-col space-y-3">
								{checklistProperties.map(({ key, label }) => (
									<label
										key={key}
										className="inline-flex items-center space-x-2 cursor-pointer select-none"
									>
										<input
											type="checkbox"
											checked={Boolean(event?.[key as keyof Event])}
											readOnly
											className="form-checkbox rounded text-blue-600"
										/>
										<span>{label}</span>
									</label>
								))}
							</div>
						</Card>
					</div>

					{/* Notes List Card spanning full height of left column */}
					<Card className="md:w-2/3 p-6 bg-white dark:bg-gray-800">
						<NotesList
							onCreate={createNote}
							noteIds={noteIds}
						/>
					</Card>
				</div>
			</div>
		</Layout>
	);
};

export default EventPage;
