import Page from "@/components/LayoutPage";
import React, { useState, useEffect, useCallback } from "react";
import { SearchUnits, Unit } from "@/dtos";
import { useNavigate } from "react-router-dom";
import { useClient } from "@/gateway";

// Import shadcn UI components
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardFooter,
} from "@/components/ui/card";

// Import icons from shadcn or another icon library you use
import { CalendarDays, Building } from "lucide-react"; // Example: lucide-react icons

const UnitsPage: React.FC = () => {
	const client = useClient();
	const navigate = useNavigate();

	const [units, setUnits] = useState<Unit[]>([]);
	const [searchTerm, setSearchTerm] = useState("");

	// Debounce search input to reduce API calls
	useEffect(() => {
		const handler = setTimeout(() => {
			fetchUnits(searchTerm);
		}, 300);

		return () => clearTimeout(handler);
	}, [searchTerm]);

	const fetchUnits = useCallback(
		async (search: string) => {
			const query = new SearchUnits();
			if (search) {
				query.searchTerm = search;
			}
			const api = await client.api(query);
			if (api.succeeded) {
				setUnits(api.response ?? []);
			}
		},
		[client]
	);

	const onUnitClick = (unitId: number) => {
		navigate(`/units/${unitId}`);
	};

	return (
		<Page title="Unit Management">
			<div className="p-6 space-y-6">
				<Input
					type="search"
					placeholder="Search units..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="w-full max-w-lg"
					aria-label="Search units"
				/>

				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
					{units.map((unit) => (
						<Card
							key={unit.id}
							onClick={() => onUnitClick(unit.id)}
							className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
							role="button"
							tabIndex={0}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									onUnitClick(unit.id);
								}
							}}
						>
							<CardHeader>
								<CardTitle>
									{unit.type} {unit.number}
								</CardTitle>
							</CardHeader>
							<CardContent className="flex flex-col justify-between flex-grow space-y-2">
								<div className="flex items-center space-x-2">
									<CalendarDays className="w-5 h-5 text-muted-foreground" />
									<span>{unit.eventsLink.length ?? 0} Upcoming Events</span>
								</div>
								<div className="flex items-center space-x-2">
									<Building className="w-5 h-5 text-muted-foreground" />
									<span>{unit.schoolsLink.length ?? 0} Linked Schools</span>
								</div>
							</CardContent>
							<CardFooter>{/* Optional footer content */}</CardFooter>
						</Card>
					))}
				</div>
			</div>
		</Page>
	);
};

export default UnitsPage;
