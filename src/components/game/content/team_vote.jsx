import { Button, List } from "antd";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import db from "../../../utils/firebase";

export default function TeamVote(props) {
	const { game, display_names, room_id, user_id } = props;

	function team_vote(result) {
		const game_doc = doc(db, "rooms", room_id);
		// if this is the last vote that needs to be counted, check if the next leader suggests a team or the quest starts
		if (Object.values(game.votes).filter((votes) => votes.length - 1 < game.current_turn).length === 1) {
			updateDoc(game_doc, { game_status: "quest" });
		}
		updateDoc(game_doc, { ["votes." + user_id]: arrayUnion(result) });
	}

	return game.game_status === "vote" ? (
		<>
			<List dataSource={game.current_team} renderItem={(x) => <List.Item>{display_names[x]}</List.Item>} />
			{game.votes[user_id].length - 1 < game.current_turn ? (
				<>
					<Button onClick={() => team_vote(true)}>approve</Button>
					<Button onClick={() => team_vote(false)}>deny</Button>
				</>
			) : (
				<>you voted to {game.votes[user_id][game.current_turn] ? "approve" : "reject"} the mission</>
			)}
		</>
	) : (
		<>no team to vote on!</>
	);
}
