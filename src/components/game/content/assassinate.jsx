import { Button, List } from "antd";
import { doc, updateDoc } from "firebase/firestore";
import db from "../../../utils/firebase";

export default function Assassinate(props) {
	const { game, user_id, display_names, room_id } = props;

	function assassinate(target) {
		const game_doc = doc(db, "rooms", room_id);
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
							{display_names[id]} <Button onClick={() => assassinate(id)}>kill???????</Button>
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
