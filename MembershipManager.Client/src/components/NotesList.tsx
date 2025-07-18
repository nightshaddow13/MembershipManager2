import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CreateNote, DeleteNote, Note, QueryNotes, UpdateNote } from "@/dtos";
import { Trash2 } from "lucide-react";
import { useClient } from "@/gateway";

interface NotesListProps {
	onCreate?: (newNoteId: number) => void;
	onEdit?: (editedNoteId: number) => void;
	onDelete?: (deletedNoteId: number) => void;
	noteIds: number[];
}

const NotesList: React.FC<NotesListProps> = ({
	onCreate,
	onEdit,
	onDelete,
	noteIds,
}) => {
	const client = useClient();

	const [notes, setNotes] = useState<Note[]>([]);
	const [editingId, setEditingId] = useState<number | null>(null);
	const [draftDescription, setDraftDescription] = useState("");
	useEffect(() => {
		(async () => await refreshNotes())();
	}, [noteIds]);

	// Start editing a note or create new
	const startEditing = (note?: Note) => {
		if (note) {
			setEditingId(note.id);
			setDraftDescription(note.description);
		} else {
			setEditingId(-1); // -1 means new note
			setDraftDescription("");
		}
	};

	const refreshNotes = async () => {
		if (noteIds.length > 0) {
			const api = await client.api(new QueryNotes({ ids: noteIds }));
			if (api.succeeded) {
				setNotes(api.response!.results ?? []);
			}
		}
	};

	// Save the note (new or edited)
	async function saveNote() {
		if (!draftDescription.trim()) return;

		if (editingId === -1) {
			// New note
			const newNote = new CreateNote({
				description: draftDescription.trim(),
			});
			const api = await client.api(newNote);
			if (api.succeeded && api.response != null) {
				const createdNoteId = parseInt(api.response!.id);
				onCreate?.(createdNoteId);
				refreshNotes();
			}
		} else {
			// Edit existing
			const updatedNote = new UpdateNote({
				id: editingId!,
				description: draftDescription.trim(),
			});
			const api = await client.api(updatedNote);
			if (api.succeeded && api.response != null) {
				onEdit?.(parseInt(api.response!.id));
			}
		}
		setEditingId(null);
		setDraftDescription("");
	}

	const cancelEditing = () => {
		setEditingId(null);
		setDraftDescription("");
	};

	async function removeNote(id: number, e: React.MouseEvent) {
		e.stopPropagation(); // Prevent triggering edit on card click

		const api = await client.api(new DeleteNote({ id: id }));
		// Call the onDelete with an array of deleted note IDs
		// Here, only one ID is deleted, but this could be extended for batch deletes
		if (api.succeeded) {
			onDelete?.(id);
			refreshNotes();
		}

		const updatedNotes = notes.filter((note) => note.id !== id);
		setNotes(updatedNotes);

		if (editingId === id) {
			cancelEditing();
		}
	}

	// You can implement additional batch delete or other functions here,
	// and call onDelete with an array of note IDs.

	return (
		<Card className="max-w-3xl mx-auto p-6 space-y-6 bg-white dark:bg-gray-800">
			<div className="flex justify-between items-center">
				<h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
					Notes
				</h2>
				<Button
					variant="outline"
					onClick={() => startEditing()}
				>
					+ Add Note
				</Button>
			</div>

			{editingId !== null && (
				<div className="space-y-2">
					<Textarea
						value={draftDescription}
						onChange={(e) => setDraftDescription(e.target.value)}
						placeholder="Enter note description"
						rows={4}
						autoFocus
						className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500"
					/>
					<div className="flex space-x-2 justify-end">
						<Button
							variant="secondary"
							onClick={cancelEditing}
						>
							Cancel
						</Button>
						<Button
							onClick={saveNote}
							disabled={!draftDescription.trim()}
						>
							Save
						</Button>
					</div>
				</div>
			)}

			{notes.length === 0 ? (
				<p className="text-center text-gray-500 dark:text-gray-400">
					No notes available.
				</p>
			) : (
				<ul className="space-y-4">
					{notes.map((note) => (
						<li key={note.id}>
							<Card
								className="p-4 flex flex-row items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
								onClick={() => startEditing(note)}
								role="button"
								tabIndex={0}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										e.preventDefault();
										startEditing(note);
									}
								}}
								aria-label={`Edit note ${note.id}`}
							>
								<p className="whitespace-pre-wrap flex-grow text-gray-900 dark:text-gray-100">
									{note.description}
								</p>
								<Button
									size="sm"
									variant="ghost"
									className="ml-4 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-600"
									onClick={(e) => removeNote(note.id, e)}
									aria-label={`Remove note ${note.id}`}
								>
									<Trash2 className="h-5 w-5" />
								</Button>
							</Card>
						</li>
					))}
				</ul>
			)}
		</Card>
	);
};

export default NotesList;
