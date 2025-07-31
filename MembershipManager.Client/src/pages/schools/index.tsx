import Page from "@/components/LayoutPage";
import SearchContainer from "@/components/SearchContainer";
import { SearchSchools } from "@/dtos";
import { ValidateAuth } from "@/useAuth";

function Index() {
	return (
		<Page title="School Management">
			<SearchContainer SearchClass={SearchSchools} />
		</Page>
	);
}

export default ValidateAuth(Index, { role: "NewMemberCoordinator" });
