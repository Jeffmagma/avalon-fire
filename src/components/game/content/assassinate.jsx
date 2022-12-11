import { Button, List } from "antd";
import { doc, updateDoc } from "firebase/firestore";

export default function Assassinate({ game, user_id, display_names, game_doc }) {
	function assassinate(target) {
		if (game.user_roles[target] === "merlin") {
			updateDoc(game_doc, { game_status: "evil_win" });
		} else {
			updateDoc(game_doc, { game_status: "good_win" });
		}
	}

	return game.user_roles[user_id] === "assassin" ? (
		<>
			<List
				dataSource={game.players}
				bordered
				renderItem={(id) => {
					return (
						<List.Item>
							{display_names[id]} <Button onClick={() => assassinate(id)}>kill??????</Button>
						</List.Item>
					);
				}}
			/>
			who do you want to assassinate?
		</>
	) : (
		<>
			waiting for {display_names[Object.keys(game.user_roles).find((key) => game.user_roles[key] === "assassin")]}{" "}
			to assassinate!
		</>
	);
}
