import { CreateSchoolNote, QuerySchool, School } from "@/dtos";
import { useClient } from "@/gateway";
import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Card } from "@/components/ui/card";
import NotesList from "@/components/NotesList";

const SchoolDetailPage = () => {
	const client = useClient();
	const schoolId = parseInt(useParams().schoolId ?? "");
	const [noteIds, setNoteIds] = useState<number[]>([]);
	const [school, setSchool] = useState<School | undefined>();

	useEffect(() => {
		(async () => await querySchool())();
	}, []);

	const querySchool = async () => {
		const api = await client.api(new QuerySchool({ id: schoolId }));
		if (api.succeeded) {
			const school = api.response!.results?.[0] ?? [];
			setSchool(school);
			setNoteIds(school?.notesLink.map((note) => note.noteId) ?? []);
		} else {
			console.error("Failed to get event");
		}
	};

	const createNote = async (newNoteId: number) => {
		const api = await client.api(
			new CreateSchoolNote({ noteId: newNoteId, schoolId: schoolId })
		);
		if (api.succeeded) {
			setNoteIds(noteIds.concat(newNoteId));
		} else {
			console.error("Failed to link note to event");
		}
	};

	if (!school) {
		return (
			<Layout title="Loading School...">
				<div className="text-center mt-10">Loading school information...</div>
			</Layout>
		);
	}

	return (
		<>
			<Layout title={`MM - ${school?.description}}`}>
				<div className="flex flex-col items-center mt-5 space-y-6">
					<h1 className="text-2xl font-bold text-center">
						{school?.description}
					</h1>

					{/* Container for side-by-side cards with notes spanning vertically */}
					<div className="flex flex-col md:flex-row md:space-x-6 mx-auto max-w-6xl w-full px-4 items-stretch">
						{/* Left side: event info and checklist stacked vertically */}
						<div className="flex flex-col md:w-1/3 space-y-6">
							{/* Event Info Card */}
							<Card className="bg-white dark:bg-gray-800 p-6 h-full flex-grow">
								<div className="text-lg space-y-4">
									<p>
										<span className="font-semibold">Type:</span>{" "}
										{school.schoolType}
									</p>
									<p>
										<span className="font-semibold">Grade Level:</span>{" "}
										{school.gradeLevels}
									</p>
									<div>
										<span className="font-semibold">Address:</span>
										<p>
											{school.address}, {school.city}, {school.state}{" "}
											{school.zipCode}
										</p>
									</div>
								</div>
							</Card>
						</div>

						{/* Notes List Card spanning full height of left column */}
						<Card className="md:w-2/3 p-6 bg-white dark:bg-gray-800 h-full flex-grow">
							<NotesList
								onCreate={createNote}
								noteIds={noteIds}
							/>
						</Card>
					</div>
				</div>
			</Layout>

			<Layout title={`School - ${school.description}`}>
				<div className="max-w-4xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded shadow">
					{/* School Name */}
					<h1 className="text-3xl font-bold mb-6 text-center">
						{school.description}
					</h1>

					{/* School Details */}
					<div className="text-lg space-y-4">
						<p>
							<span className="font-semibold">Type:</span> {school.schoolType}
						</p>
						<p>
							<span className="font-semibold">Grade Level:</span>{" "}
							{school.gradeLevels}
						</p>
						<div>
							<span className="font-semibold">Address:</span>
							<p>
								{school.address}, {school.city}, {school.state} {school.zipCode}
							</p>
						</div>
					</div>
				</div>
			</Layout>
		</>
	);
};

export default SchoolDetailPage;
