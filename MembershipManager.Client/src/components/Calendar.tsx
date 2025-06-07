// Calendar.tsx
import React, { useState, useEffect, JSX } from "react";
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

const Calendar: React.FC = () => {
	const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	const [events, setEvents] = useState<Event[]>([]);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [newEventTitle, setNewEventTitle] = useState("");
	const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
		if (typeof window !== "undefined") {
			const saved = localStorage.getItem("dark-mode");
			if (saved !== null) return saved === "true";
			return window.matchMedia("(prefers-color-scheme: dark)").matches;
		}
		return false;
	});

	useEffect(() => {
		const root = window.document.documentElement;
		if (isDarkMode) {
			root.classList.add("dark");
		} else {
			root.classList.remove("dark");
		}
		localStorage.setItem("dark-mode", isDarkMode.toString());
	}, [isDarkMode]);

	const formatDateKey = (date: Date) => format(date, "yyyy-MM-dd");

	const openAddEventDialog = (date: Date) => {
		setSelectedDate(date);
		setNewEventTitle("");
		setIsDialogOpen(true);
	};

	const addEvent = () => {
		if (!newEventTitle.trim()) return;
		const newEvent: Event = {
			id: crypto.randomUUID(),
			date: formatDateKey(selectedDate),
			title: newEventTitle.trim(),
		};
		setEvents((prev) => [...prev, newEvent]);
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
					<div
						key={day.toString()}
						className={`p-2 cursor-pointer rounded-lg border border-transparent hover:border-blue-400 dark:hover:border-blue-600 ${
							!isSameMonth(day, monthStart)
								? "text-gray-400 dark:text-gray-600"
								: "text-gray-900 dark:text-gray-100"
						} ${
							isSameDay(day, selectedDate) ? "bg-blue-100 dark:bg-blue-900" : ""
						}`}
						onClick={() => openAddEventDialog(cloneDay)}
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
										className="bg-blue-200 dark:bg-blue-700 text-blue-900 dark:text-blue-200 rounded px-1 truncate"
										title={ev.title}
									>
										{ev.title}
									</li>
								))}
							</ul>
						)}
					</div>
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

	return (
		<>
			<div className="max-w-md mx-auto p-4 border rounded-lg shadow-md bg-white dark:bg-gray-800 dark:border-gray-700">
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
				{daysOfWeek()}
				{cells()}
			</div>

			<Dialog
				open={isDialogOpen}
				onOpenChange={setIsDialogOpen}
			>
				<DialogContent className="bg-white dark:bg-gray-900 dark:text-gray-100">
					<DialogHeader>
						<DialogTitle>
							Add Event on {format(selectedDate, "PPP")}
						</DialogTitle>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="flex flex-col space-y-1">
							{/*<Label
								htmlFor="event-title"
								className="dark:text-gray-200"
							>
								Event Title
							</Label>
							<Input
								id="event-title"
								type="text"
								value={newEventTitle}
								onChange={(e) => setNewEventTitle(e.target.value)}
								placeholder="Enter event title"
								autoFocus
								className="dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-100"
							/>*/}
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setIsDialogOpen(false)}
						>
							Cancel
						</Button>
						<Button
							onClick={addEvent}
							disabled={!newEventTitle.trim()}
						>
							Add Event
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default Calendar;
