import { CheckCircleFilled, CloseCircleFilled, QuestionCircleFilled, LoadingOutlined } from "@ant-design/icons";
import { Card, Divider, Steps } from "antd";
import { players_per_mission } from "../../utils/avalon";

export default function QuestTimeline({ game }) {
	const step_items = players_per_mission[game.players.length].map((player_num, index) => ({
		title: player_num + " players",
		status:
			game.quest === index + 1
				? "process"
				: index + 1 > game.quest
				? "wait"
				: game.quest_results[index + 1]
				? "process"
				: "error",
		icon:
			game.quest === index + 1 ? (
				<LoadingOutlined />
			) : index + 1 > game.quest ? (
				<QuestionCircleFilled />
			) : game.quest_results[index + 1] ? (
				<CheckCircleFilled />
			) : (
				<CloseCircleFilled />
			),
		...(index === 3 && { description: "requires 2 fails!" }),
	}));

	return (
		<Card style={{ width: "100%" }}>
			<Divider>missions</Divider>
			<Steps items={step_items} />
		</Card>
	);
}
