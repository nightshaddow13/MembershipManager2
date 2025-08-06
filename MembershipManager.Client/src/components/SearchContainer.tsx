import { useClient } from "@/gateway";
import { useCallback, useEffect, useState } from "react";
import { Input } from "./ui/input";
import { IReturn, ISearch } from "@/dtos";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { LucideProps } from "lucide-react";

type SearchConstructor<T extends ISearch> = new () => T;

export class SearchCardStatistic {
	icon?: React.ComponentType<LucideProps>;
	text: string = "";
	statistic: number = 0;
}

export class SearchCardInfo {
	key: number = 0;
	onClick: (key: number) => void = () => {};
	title: string = "";
	statistics: SearchCardStatistic[] = [];
}

type Props<TThing, TSearch extends ISearch & IReturn<TThing[]>> = {
	SearchClass: SearchConstructor<TSearch>;
	mapToCard: (dto: TThing) => SearchCardInfo;
	pluralName: string;
};

function SearchContainer<TThing, TSearch extends ISearch & IReturn<TThing[]>>({
	SearchClass,
	mapToCard,
	pluralName,
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
			}
		},
		[client]
	);

	return (
		<div className="p-6 space-y-6">
			<Input
				type="search"
				placeholder={`Search ${pluralName}...`}
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				className="w-full max-w-lg"
				aria-label="Search units"
			/>

			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
				{things.map((thing) => {
					const cardInfo = mapToCard(thing);
					return (
						<Card
							key={cardInfo.key}
							onClick={() => cardInfo.onClick(cardInfo.key)}
							className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
							role="button"
							tabIndex={0}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									cardInfo.onClick(cardInfo.key);
								}
							}}
						>
							<CardHeader>
								<CardTitle>{cardInfo.title}</CardTitle>
							</CardHeader>
							<CardContent className="flex flex-col justify-between flex-grow space-y-2">
								{cardInfo.statistics.map((statistic, index) => (
									<div
										key={index}
										className="flex items-center space-x-2"
									>
										{statistic.icon && (
											<statistic.icon className="w-5 h-5 text-muted-foreground" />
										)}
										<span>
											{statistic.statistic} {statistic.text}
										</span>
									</div>
								))}
							</CardContent>
						</Card>
					);
				})}
			</div>
		</div>
	);
}

export default SearchContainer;
