import Page from "@/components/LayoutPage";
import SearchContainer, {
	SearchCardInfo,
	SearchCardStatistic,
} from "@/components/SearchContainer";
import { School, SearchSchools } from "@/dtos";
import { ValidateAuth } from "@/useAuth";
import { CalendarDays, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Index() {
	const navigate = useNavigate();

	function mapSchoolToCard(school: School) {
		const stat1 = new SearchCardStatistic();
		stat1.icon = CalendarDays;
		stat1.statistic = school.eventsLink.length;
		stat1.text = "Upcoming Events";

		const stat2 = new SearchCardStatistic();
		stat2.icon = Users;
		stat2.statistic = school.unitsLink.length;
		stat2.text = "Linked Units";

		const stats: SearchCardStatistic[] = [stat1, stat2];

		const card = new SearchCardInfo();

		card.key = school.id;
		card.title = school.description;
		card.onClick = (schoolId: number) => {
			navigate(`/schools/${schoolId}`);
		};
		card.statistics = stats;

		return card;
	}

	return (
		<Page title="School Management">
			<SearchContainer
				SearchClass={SearchSchools}
				mapToCard={mapSchoolToCard}
				pluralName="Schools"
			/>
		</Page>
	);
}

export default ValidateAuth(Index, { role: "NewMemberCoordinator" });
