import { useParams } from "react-router-dom";

export default () => {
	const eventId = parseInt(useParams().eventId ?? "");

	return <p>Hello Event: {eventId}</p>;
};
