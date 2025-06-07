// Calendar.tsx
import React, { useState, useEffect, useRef, JSX } from "react";
import {
	startOfMonth,
	endOfMonth,
	startOfWeek,
	endOfWeek,
	addDays,
	format,
	isSameMonth,
	isSameDay,
	addMonths,
	subMonths,
	isAfter,
	isSameDay as isSameDate,
	parseISO,
} from "date-fns";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";

interface Event {
	id: string;
	date: string; // yyyy-MM-dd
	title: string;
}

// Smaller sample data with some multiple events on the same day
const sampleEvents: Event[] = [
	{
		id: "1",
		date: format(new Date(), "yyyy-MM-dd"),
		title: "Meeting with Bob",
	},
	{
		id: "2",
		date: format(new Date(), "yyyy-MM-dd"),
		title: "Lunch with Alice",
	},
	{
		id: "3",
		date: format(addDays(new Date(), 1), "yyyy-MM-dd"),
		title: "Project deadline",
	},
	{
		id: "4",
		date: format(addDays(new Date(), 2), "yyyy-MM-dd"),
		title: "Call with client",
	},
	{
		id: "5",
		date: format(addDays(new Date(), 2), "yyyy-MM-dd"),
		title: "Team standup",
	},
	{
		id: "6",
		date: format(addDays(new Date(), 5), "yyyy-MM-dd"),
		title: "Doctor appointment",
	},
];

const Calendar: React.FC = () => {
	const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [events, setEvents] = useState<Event[]>(sampleEvents);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [newEventTitle, setNewEventTitle] = useState("");
	const [editEventId, setEditEventId] = useState<string | null>(null);
	const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
		if (typeof window !== "undefined") {
			const saved = localStorage.getItem("dark-mode");
			if (saved !== null) return saved === "true";
			return window.matchMedia("(prefers-color-scheme: dark)").matches;
		}
		return false;
	});

	const calendarRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const eventRefs = useRef<Record<string, HTMLDivElement | null>>({});

	// For selecting which event on selectedDate to view/edit
	const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

	useEffect(() => {
		const root = window.document.documentElement;
		if (isDarkMode) {
			root.classList.add("dark");
		} else {
			root.classList.remove("dark");
		}
		localStorage.setItem("dark-mode", isDarkMode.toString());
	}, [isDarkMode]);

	// When selectedDate changes, reset selectedEventId to first event or null
	useEffect(() => {
		if (!selectedDate) {
			setSelectedEventId(null);
			return;
		}
		const dayKey = format(selectedDate, "yyyy-MM-dd");
		const dayEvents = events.filter((ev) => ev.date === dayKey);
		setSelectedEventId(dayEvents.length > 0 ? dayEvents[0].id : null);
	}, [selectedDate, events]);

	// Scroll to the selected event in the sidebar when it changes
	useEffect(() => {
		if (selectedEventId) {
			const ref = eventRefs.current[selectedEventId];
			if (ref) {
				ref.scrollIntoView({ behavior: "smooth", block: "center" });
			}
		}
	}, [selectedEventId]);

	const formatDateKey = (date: Date) => format(date, "yyyy-MM-dd");

	// Clicking a day just selects the date, no editing
	const onDayClick = (day: Date) => {
		setSelectedDate(day);
	};

	const openAddEventDialog = (date: Date) => {
		setSelectedDate(date);
		setNewEventTitle("");
		setEditEventId(null);
		setIsDialogOpen(true);
	};

	const openEditEventDialog = (event: Event) => {
		setSelectedDate(parseISO(event.date));
		setNewEventTitle(event.title);
		setEditEventId(event.id);
		setSelectedEventId(event.id);
		setIsDialogOpen(true);
	};

	const addOrEditEvent = () => {
		if (!newEventTitle.trim() || !selectedDate) return;

		if (editEventId) {
			// Edit existing event
			setEvents((prev) =>
				prev.map((ev) =>
					ev.id === editEventId
						? {
								...ev,
								title: newEventTitle.trim(),
								date: formatDateKey(selectedDate),
						  }
						: ev
				)
			);
		} else {
			// Add new event
			const newEvent: Event = {
				id: crypto.randomUUID(),
				date: formatDateKey(selectedDate),
				title: newEventTitle.trim(),
			};
			setEvents((prev) => [...prev, newEvent]);
			setSelectedEventId(newEvent.id);
		}
		setIsDialogOpen(false);
	};

	const goToToday = () => {
		const today = new Date();
		setCurrentMonth(today);
		setSelectedDate(today);
	};

	const header = () => (
		<div className="flex justify-between items-center mb-4">
			<div className="flex space-x-2">
				<Button
					variant="outline"
					onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
				>
					Prev
				</Button>
				<Button
					variant="outline"
					onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
				>
					Next
				</Button>
			</div>
			<h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
				{format(currentMonth, "MMMM yyyy")}
			</h2>
			<Button
				variant="outline"
				onClick={goToToday}
			>
				Today
			</Button>
		</div>
	);

	const daysOfWeek = () => {
		const days: JSX.Element[] = [];
		const startDate = startOfWeek(currentMonth, { weekStartsOn: 0 });
		for (let i = 0; i < 7; i++) {
			days.push(
				<div
					key={i}
					className="text-center font-medium text-gray-500 dark:text-gray-400"
				>
					{format(addDays(startDate, i), "EEE")}
				</div>
			);
		}
		return <div className="grid grid-cols-7 mb-2">{days}</div>;
	};

	const cells = () => {
		const monthStart = startOfMonth(currentMonth);
		const monthEnd = endOfMonth(monthStart);
		const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
		const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

		const rows: JSX.Element[] = [];
		let days: JSX.Element[] = [];
		let day = startDate;

		while (day <= endDate) {
			for (let i = 0; i < 7; i++) {
				const formattedDate = format(day, "d");
				const cloneDay = day;
				const dayKey = formatDateKey(day);

				const dayEvents = events.filter((ev) => ev.date === dayKey);

				days.push(
					<button
						key={day.toString()}
						type="button"
						className={`p-2 text-left cursor-pointer rounded-lg border border-transparent hover:border-blue-400 dark:hover:border-blue-600 w-full ${
							!isSameMonth(day, monthStart)
								? "text-gray-400 dark:text-gray-600"
								: "text-gray-900 dark:text-gray-100"
						} ${
							isSameDay(day, selectedDate || new Date(0))
								? "bg-blue-100 dark:bg-blue-900"
								: ""
						}`}
						onClick={() => onDayClick(cloneDay)}
						onDoubleClick={() => openAddEventDialog(cloneDay)}
						aria-label={`Select day ${formattedDate}`}
					>
						<div className="flex justify-between items-center">
							<span className="font-medium">{formattedDate}</span>
							{dayEvents.length > 0 && (
								<span className="ml-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
									{dayEvents.length}
								</span>
							)}
						</div>
						{dayEvents.length > 0 && (
							<ul className="mt-1 max-h-20 overflow-y-auto text-xs space-y-1">
								{dayEvents.map((ev) => (
									<li
										key={ev.id}
										className="bg-blue-200 dark:bg-blue-700 text-blue-900 dark:text-blue-200 rounded px-1 truncate cursor-pointer"
										title={ev.title}
										onClick={(e) => {
											e.stopPropagation();
											openEditEventDialog(ev);
										}}
										tabIndex={0}
										onKeyDown={(e) => {
											if (e.key === "Enter" || e.key === " ") {
												e.preventDefault();
												openEditEventDialog(ev);
											}
										}}
										role="button"
										aria-label={`Edit event ${ev.title}`}
									>
										{ev.title}
									</li>
								))}
							</ul>
						)}
					</button>
				);

				day = addDays(day, 1);
			}

			rows.push(
				<div
					key={day.toString()}
					className="grid grid-cols-7 gap-1 mb-1"
				>
					{days}
				</div>
			);

			days = [];
		}

		return <div>{rows}</div>;
	};

	// Upcoming events starting from today (including today), sorted ascending
	const filteredUpcomingEvents = events
		.filter((ev) => {
			const evDate = parseISO(ev.date);
			const today = new Date();
			return isSameDate(evDate, today) || isAfter(evDate, today);
		})
		.sort((a, b) => (a.date > b.date ? 1 : -1));

	// Group events by date for sidebar selection
	const eventsByDate = filteredUpcomingEvents.reduce<Record<string, Event[]>>(
		(acc, ev) => {
			acc[ev.date] = acc[ev.date] || [];
			acc[ev.date].push(ev);
			return acc;
		},
		{}
	);

	// Sidebar events for selectedDate or all upcoming if no selectedDate
	const sidebarEvents = selectedDate
		? eventsByDate[formatDateKey(selectedDate)] || []
		: filteredUpcomingEvents;

	// Scroll to selected event in sidebar
	useEffect(() => {
		if (selectedEventId) {
			const ref = eventRefs.current[selectedEventId];
			if (ref) {
				ref.scrollIntoView({ behavior: "smooth", block: "center" });
			}
		}
	}, [selectedEventId]);

	// Handle clicks outside calendar and sidebar to clear selectedDate (show all events)
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const calendarEl = calendarRef.current;
			const sidebarEl = containerRef.current;
			if (
				calendarEl &&
				sidebarEl &&
				!calendarEl.contains(event.target as Node) &&
				!sidebarEl.contains(event.target as Node)
			) {
				setSelectedDate(null);
				setSelectedEventId(null);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<>
			<div className="max-w-5xl mx-auto px-6 py-6 border rounded-lg shadow-md bg-white dark:bg-gray-800 dark:border-gray-700">
				<div className="flex justify-end mb-2">
					<Button
						variant="ghost"
						size="sm"
						onClick={() => setIsDarkMode((prev) => !prev)}
						aria-label="Toggle dark mode"
					>
						{isDarkMode ? "🌞 Light" : "🌙 Dark"}
					</Button>
				</div>

				{header()}

				<div className="flex flex-col md:flex-row md:gap-x-8">
					{/* Calendar grid with ref */}
					<div
						className="md:w-2/3 max-w-[600px] mx-auto md:mx-0"
						ref={calendarRef}
					>
						{daysOfWeek()}
						{cells()}
					</div>

					{/* Upcoming events sidebar, height matched to calendar */}
					<aside
						className="md:w-1/3 mt-6 md:mt-0 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden relative"
						aria-label="Upcoming events"
						style={{
							maxHeight: calendarRef.current?.offsetHeight
								? `${calendarRef.current.offsetHeight}px`
								: "600px",
						}}
					>
						<div className="flex justify-between items-center mb-4">
							<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
								{selectedDate
									? `Events on ${format(selectedDate, "PPP")}`
									: "Upcoming Events"}
							</h3>

							{/* + Icon Button with Tooltip */}
							<button
								type="button"
								onClick={() => {
									// If no date selected, default to today for new event
									openAddEventDialog(selectedDate || new Date());
								}}
								aria-label="Add new event"
								className="relative p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
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
								{/* Tooltip */}
								<span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none">
									Add new event
								</span>
							</button>
						</div>

						<div
							ref={containerRef}
							className="flex-grow overflow-y-auto pr-2"
							tabIndex={0}
						>
							{sidebarEvents.length === 0 ? (
								<p className="text-gray-600 dark:text-gray-400">
									{selectedDate
										? "No events on this day."
										: "No upcoming events."}
								</p>
							) : (
								<div className="space-y-3">
									{sidebarEvents.map((ev) => (
										<div
											key={ev.id}
											ref={(el) => {
												eventRefs.current[ev.id] = el;
											}}
											tabIndex={0}
											className={`border border-gray-300 dark:border-gray-700 rounded p-2 bg-white dark:bg-gray-800 shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${
												ev.id === selectedEventId
													? "ring-2 ring-blue-500 dark:ring-blue-400"
													: ""
											}`}
											onClick={() => {
												setSelectedEventId(ev.id);
												setSelectedDate(parseISO(ev.date));
												setCurrentMonth(parseISO(ev.date));
												openEditEventDialog(ev);
											}}
											onDoubleClick={() => openEditEventDialog(ev)}
											onKeyDown={(e) => {
												if (e.key === "Enter" || e.key === " ") {
													e.preventDefault();
													setSelectedEventId(ev.id);
													setSelectedDate(parseISO(ev.date));
													setCurrentMonth(parseISO(ev.date));
													openEditEventDialog(ev);
												}
												if (e.key === "e" || e.key === "E") {
													e.preventDefault();
													openEditEventDialog(ev);
												}
											}}
											title={ev.title}
											role="button"
											aria-pressed={ev.id === selectedEventId}
											aria-label={`Event ${ev.title} on ${format(
												parseISO(ev.date),
												"PPP"
											)}. Click to edit.`}
										>
											<div className="flex justify-between items-center">
												<span className="font-semibold text-blue-600 dark:text-blue-400 truncate">
													{ev.title}
												</span>
												<span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
													{format(parseISO(ev.date), "PPP")}
												</span>
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					</aside>
				</div>
			</div>

			{/* Add/Edit event dialog */}
			<Dialog
				open={isDialogOpen}
				onOpenChange={setIsDialogOpen}
			>
				<DialogContent className="bg-white dark:bg-gray-900 dark:text-gray-100">
					<DialogHeader>
						<DialogTitle>
							{editEventId ? "Edit Event" : "Add Event"} on{" "}
							{selectedDate ? format(selectedDate, "PPP") : ""}
						</DialogTitle>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="flex flex-col space-y-1">
							<label
								htmlFor="event-title"
								className="dark:text-gray-200 text-sm font-medium"
							>
								Event Title
							</label>
							<input
								id="event-title"
								type="text"
								value={newEventTitle}
								onChange={(e) => setNewEventTitle(e.target.value)}
								placeholder="Enter event title"
								autoFocus
								className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-100"
							/>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => {
								setIsDialogOpen(false);
								setEditEventId(null);
							}}
						>
							Cancel
						</Button>
						<Button
							onClick={addOrEditEvent}
							disabled={!newEventTitle.trim()}
						>
							{editEventId ? "Save" : "Add Event"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default Calendar;
