import { useClient } from "@/gateway";
import { useCallback, useEffect, useState } from "react";
import { Input } from "./ui/input";
import { IReturn, ISearch, QueryResponse } from "@/dtos";

type Props<TThing> = {
	search: (dto: ISearch) => IReturn<QueryResponse<any>>;
};

function SearchContainer<TThing>({ search }: Props<TThing>) {
	const client = useClient();

	const [things, setThings] = useState<TThing[]>([]);
	const [searchTerm, setSearchTerm] = useState("");

	useEffect(() => {
		const handler = setTimeout(() => {
			fetchThings(searchTerm);
		}, 300);

		return () => clearTimeout(handler);
	}, [searchTerm]);

	const fetchThings = useCallback(
		async (searchTerm: string) => {
			//const query = new search();
			//if (search) {
			//	query.searchTerm = searchTerm;
			//}
			//const api = await client.api(query);
			//if (api.succeeded) {
			//setThings(api.response ?? []);
			//}
		},
		[client]
	);

	return (
		<div className="p-6 space-y-6">
			{/*
			<Input
				type="search"
				placeholder="Search units..."
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				className="w-full max-w-lg"
				aria-label="Search units"
			/>
            */}

			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
				{/*
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
						<CardFooter>*/}
				{/* Optional footer content */}
				{/*</CardFooter>
					</Card>
				))}*/}
			</div>
		</div>
	);
}

export default SearchContainer;
