import { arrayUnion, updateDoc } from "firebase/firestore";
import { useState } from "react";
import db from "../../../utils/firebase";

export default function QuestVote(props) {
	const { game, display_names } = props;
	const [voted, set_voted] = useState(false);

	function quest_vote(result) {
		const game_doc = doc(db, "rooms", room_id);
		updateDoc(game_doc, { quest_votes: arrayUnion(result) });
		set_voted(true);
	}

	return (
		<>
			do you want this mission to succeed?
			<List dataSource={game.current_team} renderItem={(x) => <List.Item>{display_names[x]}</List.Item>} />
			{voted === false ? (
				<>
					<Button onClick={() => quest_vote(true)}>approve</Button>
					<Button onClick={() => quest_vote(false)}>deny</Button>
				</>
			) : (
				<>you voted to {game.votes[user_id][game.current_turn] ? "approve" : "reject"} the mission</>
			)}
		</>
	);
}
