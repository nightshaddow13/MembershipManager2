// EventCalendar.tsx
import React, { useState, useEffect, useRef } from "react";
import { Card } from "./ui/card";

export class LinkedListDisplayElement {
	id: number;
	description: string;

	constructor(id: number, description: string) {
		(this.id = id), (this.description = description);
	}
}

interface LinkedListCardProps {
	displayElements: LinkedListDisplayElement[];
	name: string;
	pluralName: string;
	onAddRelationship?: () => void;
	onEditRelationship?: (thing: LinkedListDisplayElement) => void;
	initialSelectedDate?: Date | null;
}

const LinkedListCard: React.FC<LinkedListCardProps> = ({
	displayElements: things,
	name: thingName,
	pluralName: pluralThingName,
	onAddRelationship: onAddThing,
	onEditRelationship: onEditThing,
}) => {
	const [selectedThingId, setSelectedThingId] = useState<number | null>(null);

	const calendarRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const eventRefs = useRef<Record<string, HTMLDivElement | null>>({});

	// Scroll to the selected event in the sidebar when it changes
	useEffect(() => {
		if (selectedThingId) {
			const ref = eventRefs.current[selectedThingId];
			if (ref) {
				ref.scrollIntoView({ behavior: "smooth", block: "center" });
			}
		}
	}, [selectedThingId]);

	// Click on + button triggers add event callback for selectedDate or today
	const onAddClick = () => {
		if (onAddThing) onAddThing();
	};

	// Click on event triggers edit event callback
	const onThingClick = (thing: LinkedListDisplayElement) => {
		setSelectedThingId(thing.id);
		if (onEditThing) onEditThing(thing);
	};

	return (
		<Card
			aria-label={`"Linked ${pluralThingName}"`}
			className="bg-white dark:bg-gray-800 p-6 h-full flex-grow"
			style={{
				maxHeight: calendarRef.current?.offsetHeight
					? `${calendarRef.current.offsetHeight}px`
					: "600px",
			}}
		>
			<div className="flex justify-between items-center mb-4 px-4">
				<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
					Linked {pluralThingName}
				</h3>

				{/* + Icon Button with Tooltip */}
				<button
					type="button"
					onClick={onAddClick}
					aria-label={`"Add new ${thingName}"`}
					className="relative p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 group"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-6 w-6 text-blue-600 dark:text-blue-400"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={2}
						aria-hidden="true"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M12 4v16m8-8H4"
						/>
					</svg>
				</button>
			</div>

			<div
				ref={containerRef}
				className="flex-grow overflow-y-auto pr-2 px-4"
				tabIndex={0}
			>
				{things.length === 0 ? (
					<p className="text-gray-600 dark:text-gray-400">{`"No ${pluralThingName} linked..."`}</p>
				) : (
					<div className="space-y-3">
						{things.map((ev) => (
							<div
								key={ev.id}
								ref={(el) => {
									eventRefs.current[ev.id] = el;
								}}
								tabIndex={0}
								className={`border border-gray-300 dark:border-gray-700 rounded p-2 bg-white dark:bg-gray-800 shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${
									ev.id === selectedThingId
										? "ring-2 ring-blue-500 dark:ring-blue-400"
										: ""
								}`}
								onClick={() => onThingClick(ev)}
								onDoubleClick={() => onThingClick(ev)}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										e.preventDefault();
										onThingClick(ev);
									}
									if (e.key === "e" || e.key === "E") {
										e.preventDefault();
										onThingClick(ev);
									}
								}}
								title={ev.description}
								role="button"
								aria-pressed={ev.id === selectedThingId}
								aria-label={ev.description}
							>
								<div className="flex justify-between items-center">
									<span className="font-semibold text-blue-600 dark:text-blue-400 truncate">
										{ev.description}
									</span>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</Card>
	);
};

export default LinkedListCard;
