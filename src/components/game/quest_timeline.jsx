import { CheckCircleFilled, CloseCircleFilled, QuestionCircleFilled, MehFilled } from "@ant-design/icons";
import { Card, Divider, Steps } from "antd";
import { players_per_mission } from "../../utils/avalon";

import "../../test.css";

export default function QuestTimeline({ game }) {
	const step_items = players_per_mission[game.players.length].map((player_num, index) => ({
		title: player_num + " players",
		...(game.quest === index + 1 && { status: "process", icon: <MehFilled /> }),
		...(index + 1 > game.quest && { status: "wait", icon: <QuestionCircleFilled /> }),
		...(game.quest_results[index] === true && { status: "process", icon: <CheckCircleFilled /> }),
		...(game.quest_results[index] === false && { status: "error	", icon: <CloseCircleFilled /> }),
		...(index === 3 &&
			players_per_mission.two_fail(game.players.length) && {
				description: "requires 2 fails!",
			}),
	}));

	return (
		<Card style={{ width: "100%" }}>
			<Divider>missions</Divider>
			<Steps items={step_items} />
		</Card>
	);
}
