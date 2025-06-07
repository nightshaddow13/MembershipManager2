// EventCalendar.tsx
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
	compareAsc,
} from "date-fns";
import { Button } from "@/components/ui/button";

export interface Event {
	id: string;
	datetime: string; // ISO 8601 datetime with offset, e.g. '2024-06-10T09:00:00-04:00'
	title: string;
}

interface EventCalendarProps {
	events: Event[];
	onAddEvent?: (date: Date) => void; // called when user clicks + or double clicks a day
	onEditEvent?: (event: Event) => void; // called when user clicks an event to edit
	initialMonth?: Date;
	initialSelectedDate?: Date | null;
	className?: string;
}

const EventCalendar: React.FC<EventCalendarProps> = ({
	events,
	onAddEvent,
	onEditEvent,
	initialMonth,
	initialSelectedDate = null,
	className,
}) => {
	const [currentMonth, setCurrentMonth] = useState<Date>(
		initialMonth || new Date()
	);
	const [selectedDate, setSelectedDate] = useState<Date | null>(
		initialSelectedDate
	);
	const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

	const calendarRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const eventRefs = useRef<Record<string, HTMLDivElement | null>>({});

	// Helper to parse event datetime string to Date object
	const parseEventDateTime = (ev: Event): Date => parseISO(ev.datetime);

	// Helper to get event date key (yyyy-MM-dd) in local time
	const getEventDateKey = (ev: Event) =>
		format(parseEventDateTime(ev), "yyyy-MM-dd");

	// When selectedDate or events change, reset selectedEventId to first event or null
	useEffect(() => {
		if (!selectedDate) {
			setSelectedEventId(null);
			return;
		}
		const dayKey = format(selectedDate, "yyyy-MM-dd");
		const dayEvents = events
			.filter((ev) => getEventDateKey(ev) === dayKey)
			.sort((a, b) => compareAsc(parseEventDateTime(a), parseEventDateTime(b)));
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

	// Clicking a day selects the date
	const onDayClick = (day: Date) => {
		setSelectedDate(day);
	};

	// Double click a day triggers add event callback
	const onDayDoubleClick = (day: Date) => {
		if (onAddEvent) onAddEvent(day);
	};

	// Click on + button triggers add event callback for selectedDate or today
	const onAddClick = () => {
		if (onAddEvent) onAddEvent(selectedDate || new Date());
	};

	// Click on event triggers edit event callback
	const onEventClick = (event: Event) => {
		setSelectedEventId(event.id);
		setSelectedDate(parseEventDateTime(event));
		setCurrentMonth(parseEventDateTime(event));
		if (onEditEvent) onEditEvent(event);
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
					aria-label="Previous month"
				>
					Prev
				</Button>
				<Button
					variant="outline"
					onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
					aria-label="Next month"
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
				aria-label="Go to today"
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

				// Filter events for this day and sort by datetime ascending
				const dayEvents = events
					.filter((ev) => getEventDateKey(ev) === dayKey)
					.sort((a, b) =>
						compareAsc(parseEventDateTime(a), parseEventDateTime(b))
					);

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
						onDoubleClick={() => onDayDoubleClick(cloneDay)}
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
											onEventClick(ev);
										}}
										tabIndex={0}
										onKeyDown={(e) => {
											if (e.key === "Enter" || e.key === " ") {
												e.preventDefault();
												onEventClick(ev);
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

	// Filter upcoming events starting from today (including today), sorted ascending by datetime
	const today = new Date();
	const filteredUpcomingEvents = events
		.filter((ev) => {
			const evDate = parseEventDateTime(ev);
			return isSameDate(evDate, today) || isAfter(evDate, today);
		})
		.sort((a, b) => compareAsc(parseEventDateTime(a), parseEventDateTime(b)));

	// Group events by date key (local date)
	const eventsByDate = filteredUpcomingEvents.reduce<Record<string, Event[]>>(
		(acc, ev) => {
			const dateKey = getEventDateKey(ev);
			acc[dateKey] = acc[dateKey] || [];
			acc[dateKey].push(ev);
			return acc;
		},
		{}
	);

	// Sort each day's events by datetime ascending
	Object.keys(eventsByDate).forEach((dateKey) => {
		eventsByDate[dateKey].sort((a, b) =>
			compareAsc(parseEventDateTime(a), parseEventDateTime(b))
		);
	});

	// Sidebar events for selectedDate or all upcoming if no selectedDate
	const sidebarEvents = selectedDate
		? eventsByDate[formatDateKey(selectedDate)] || []
		: filteredUpcomingEvents;

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
		<div className={className}>
			{header()}

			<div className="flex flex-col md:flex-row md:gap-x-8">
				{/* Calendar grid */}
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
							onClick={onAddClick}
							aria-label="Add new event"
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
										onClick={() => onEventClick(ev)}
										onDoubleClick={() => onEventClick(ev)}
										onKeyDown={(e) => {
											if (e.key === "Enter" || e.key === " ") {
												e.preventDefault();
												onEventClick(ev);
											}
											if (e.key === "e" || e.key === "E") {
												e.preventDefault();
												onEventClick(ev);
											}
										}}
										title={`${format(parseEventDateTime(ev), "p")} - ${
											ev.title
										}`}
										role="button"
										aria-pressed={ev.id === selectedEventId}
										aria-label={`Event ${ev.title} on ${format(
											parseEventDateTime(ev),
											"PPP"
										)}. Click to edit.`}
									>
										<div className="flex justify-between items-center">
											<span className="font-semibold text-blue-600 dark:text-blue-400 truncate">
												{/* Display time only when a date is selected */}
												{selectedDate && (
													<span className="font-mono mr-1 text-xs text-gray-700 dark:text-gray-300">
														{format(parseEventDateTime(ev), "p")}
													</span>
												)}
												{ev.title}
											</span>
											{!selectedDate && (
												<span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
													{format(parseEventDateTime(ev), "PPP")}
												</span>
											)}
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</aside>
			</div>
		</div>
	);
};

export default EventCalendar;
