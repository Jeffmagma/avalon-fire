import { CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";
import { players_per_mission } from "../../utils/avalon";

export default function QuestTimeline(props) {
	const { game } = props;

	return (
		<>
			mission results:
			{game.quest_results.map((result, index) => {
				if (index === 3) {
					if (players_per_mission.two_fail(game.players.length)) {
						return <>{result ? <CheckCircleFilled /> : <CloseCircleFilled />} two fails required</>;
					}
				} else {
					return result ? <CheckCircleFilled /> : <CloseCircleFilled />;
				}
			})}
		</>
	);
}
