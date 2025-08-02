import Page from "@/components/LayoutPage";
import SearchContainer, {
	SearchCardInfo,
	SearchCardStatistic,
} from "@/components/SearchContainer";
import { School, SearchSchools } from "@/dtos";
import { ValidateAuth } from "@/useAuth";
import { Building, CalendarDays } from "lucide-react";

function Index() {
	function mapSchoolToCard(school: School) {
		const stat1 = new SearchCardStatistic();
		stat1.icon = CalendarDays;
		stat1.statistic = 1;
		stat1.text = "one";

		const stat2 = new SearchCardStatistic();
		stat2.icon = Building;
		stat2.statistic = 2;
		stat2.text = "Two";

		const stats: SearchCardStatistic[] = [stat1, stat2];

		const card = new SearchCardInfo();

		card.key = school.id;
		card.title = school.description;
		card.onClick = (number: number) => {
			console.log(number);
		};
		card.statistics = stats;

		return card;
	}

	return (
		<Page title="School Management">
			<SearchContainer
				SearchClass={SearchSchools}
				mapToCard={mapSchoolToCard}
			/>
		</Page>
	);
}

export default ValidateAuth(Index, { role: "NewMemberCoordinator" });
