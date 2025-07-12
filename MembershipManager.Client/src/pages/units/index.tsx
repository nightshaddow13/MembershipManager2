import Page from "@/components/LayoutPage";
import React, { useState, useEffect, useCallback } from "react";
import { QueryUnits, Unit } from "@/dtos";
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
			const query = new QueryUnits();
			if (search) {
				query.number = parseInt(search);
			}
			const api = await client.api(query);
			if (api.succeeded) {
				setUnits(api.response?.results ?? []);
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
							<CardContent className="flex flex-col justify-between flex-grow">
								<p>
									<strong>Upcoming Events:</strong>{" "}
									{unit.eventsLink.length ?? 0}
								</p>
								<p>
									<strong>Linked Schools:</strong>{" "}
									{unit.schoolsLink.length ?? 0}
								</p>
							</CardContent>
							<CardFooter>
								{/* Optional: Add footer content if needed */}
							</CardFooter>
						</Card>
					))}
				</div>
			</div>
		</Page>
	);
};

export default UnitsPage;
