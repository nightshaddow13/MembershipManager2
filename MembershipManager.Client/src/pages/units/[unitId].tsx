import { CreateUnitNote, QueryUnits, Unit } from "@/dtos";
import { useClient } from "@/gateway";
import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Card } from "@/components/ui/card";
import NotesList from "@/components/NotesList";
import LinkedListCard, {
	LinkedListDisplayElement,
} from "@/components/LinkedListCard";

const UnitDetailPage = () => {
	const client = useClient();
	const unitId = parseInt(useParams().unitId ?? "");
	const [noteIds, setNoteIds] = useState<number[]>([]);
	const [unit, setUnit] = useState<Unit | undefined>();

	useEffect(() => {
		(async () => await queryUnit())();
	}, []);

	const queryUnit = async () => {
		const api = await client.api(new QueryUnits({ id: unitId }));
		if (api.succeeded) {
			const unit = api.response!.results?.[0] ?? [];
			setUnit(unit);
			setNoteIds(unit?.notesLink.map((note) => note.noteId) ?? []);
		} else {
			console.error("Failed to get unit");
		}
	};

	const createNote = async (newNoteId: number) => {
		const api = await client.api(
			new CreateUnitNote({ noteId: newNoteId, unitId: unitId })
		);
		if (api.succeeded) {
			setNoteIds(noteIds.concat(newNoteId));
		} else {
			console.error("Failed to link note to unit");
		}
	};

	if (!unit) {
		return (
			<Layout title="Loading Unit...">
				<div className="text-center mt-10">Loading unit information...</div>
			</Layout>
		);
	}

	return (
		<>
			<Layout title={`${unit.type} ${unit.number}`}>
				<div className="flex flex-col items-center mt-5 space-y-6">
					<h1 className="text-2xl font-bold text-center">
						{unit.type} {unit.number}
					</h1>

					{/* Container for side-by-side cards with notes spanning vertically */}
					<div className="flex flex-col md:flex-row md:space-x-6 mx-auto max-w-6xl w-full px-4 items-stretch">
						{/* Left side: unit info stacked vertically */}
						<div className="flex flex-col md:w-1/3 space-y-6">
							{/* Unit Info Card */}
							<Card className="bg-white dark:bg-gray-800 p-6 h-full flex-grow">
								<div className="text-lg space-y-4">
									<p>
										<span className="font-semibold">Council:</span>{" "}
										{unit.district?.council?.description ?? "N/A"}
									</p>
									<p>
										<span className="font-semibold">District:</span>{" "}
										{unit.district?.description ?? "N/A"}
									</p>
									<p>
										<span className="font-semibold">Sex:</span> {unit.sex}
									</p>
								</div>
							</Card>
							<LinkedListCard
								displayElements={unit.schoolsLink.map((link) => {
									return new LinkedListDisplayElement(
										link.id,
										link.school.description
									);
								})}
								name="School"
								pluralName="Schools"
							/>
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
		</>
	);
};

export default UnitDetailPage;
