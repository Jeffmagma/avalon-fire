import { Button, List } from "antd";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import db from "../../utils/firebase";

export default function TeamVote(props) {
	const { game, display_names, room_id, user_id } = props;

	function vote(result) {
		const game_doc = doc(db, "rooms", room_id);
		// if this is the last vote that needs to be counted,
		if (Object.values(game.votes).filter((votes) => votes.length - 1 < game.current_turn).length === 1) {
			updateDoc(game_doc, { game_status: "quest" });
		}
		updateDoc(game_doc, { ["votes." + user_id]: arrayUnion(result) });
	}

	return game.game_status === "vote" ? (
		<>
			<List dataSource={game.current_team} renderItem={(x) => <List.Item>{display_names[x]}</List.Item>} />
			<Button disabled={game.votes[user_id].length - 1 === game.current_turn} onClick={() => vote(true)}>
				approve
			</Button>
			<Button disabled={game.votes[user_id].length - 1 === game.current_turn} onClick={() => vote(false)}>
				deny
			</Button>
		</>
	) : (
		<>no team to vote on!</>
	);
}
