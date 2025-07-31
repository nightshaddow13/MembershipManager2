import { useClient } from "@/gateway";
import { useCallback, useEffect, useState } from "react";
import { Input } from "./ui/input";
import { IReturn, ISearch, QueryResponse } from "@/dtos";

type SearchConstructor<T extends ISearch> = new () => T;

export class SearchCardInfo {}

type Props<TThing, TSearch extends ISearch & IReturn<TThing[]>> = {
	SearchClass: SearchConstructor<TSearch>;
	mapToCard: (dto: TThing) => SearchCardInfo;
};

function SearchContainer<TThing, TSearch extends ISearch & IReturn<TThing[]>>({
	SearchClass,
	mapToCard,
}: Props<TThing, TSearch>) {
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
			const query = new SearchClass();
			query.searchTerm = searchTerm;

			const api = await client.api(query);
			if (api.succeeded) {
				setThings(api.response ?? []);
				console.info(things);
			}
		},
		[client]
	);

	return (
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
				{things.map((thing) => (
					<p>thing</p>
				))}
			</div>
		</div>
	);
}

export default SearchContainer;
