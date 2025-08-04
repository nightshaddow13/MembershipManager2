import Page from "@/components/LayoutPage";
import { SearchUnits, Unit } from "@/dtos";
import { useNavigate } from "react-router-dom";

// Import icons from shadcn or another icon library you use
import { CalendarDays, Building } from "lucide-react"; // Example: lucide-react icons
import SearchContainer, {
	SearchCardInfo,
	SearchCardStatistic,
} from "@/components/SearchContainer";

const UnitsPage: React.FC = () => {
	const navigate = useNavigate();

	function mapUnitToCard(unit: Unit) {
		const stat1 = new SearchCardStatistic();
		stat1.icon = CalendarDays;
		stat1.statistic = unit.eventsLink.length;
		stat1.text = "Upcoming Events";

		const stat2 = new SearchCardStatistic();
		stat2.icon = Building;
		stat2.statistic = unit.schoolsLink.length;
		stat2.text = "Linked Schools";

		const stats: SearchCardStatistic[] = [stat1, stat2];

		const card = new SearchCardInfo();

		card.key = unit.id;
		card.title = `${unit.type} ${unit.number}`;
		card.onClick = (unitId: number) => {
			navigate(`/units/${unitId}`);
		};
		card.statistics = stats;

		return card;
	}

	return (
		<Page title="Unit Management">
			<SearchContainer
				SearchClass={SearchUnits}
				mapToCard={mapUnitToCard}
				pluralName="Units"
			/>
		</Page>
	);
};

export default UnitsPage;
