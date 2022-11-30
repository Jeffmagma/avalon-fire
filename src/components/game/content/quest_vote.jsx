import { List, Button } from "antd";
import { doc, arrayUnion, updateDoc } from "firebase/firestore";
import { useState } from "react";

import db from "../../../utils/firebase";
import { roles } from "../../../utils/avalon";

export default function QuestVote(props) {
	const { game, display_names, room_id, user_id } = props;
	const [voted, set_voted] = useState(false);

	function quest_vote(result) {
		const game_doc = doc(db, "rooms", room_id);
		// this is the last vote that needs to be cast
		// TODO maybe change all the "last votes" stuff to the creator of the room?
		if (game.quest_votes.length === game.current_team.length - 1) {
			updateDoc(game_doc, {
				quest_result: arrayUnion(result && !game.quest_votes.includes(false)),
				current_turn: game.current_turn + 1,
				current_leader: (game.current_turn + 1) % game.players.length,
				current_team: [],
				quest_votes: [],
				game_status: "select",
			});
		} else {
			updateDoc(game_doc, { quest_votes: arrayUnion(result) });
		}
		set_voted(true);
	}

	return game.current_team.includes(user_id) ? (
		<>
			do you want this mission to succeed?
			<List dataSource={game.current_team} renderItem={(x) => <List.Item>{display_names[x]}</List.Item>} />
			{voted === false ? (
				<>
					<Button onClick={() => quest_vote(true)}>pass</Button>
					<Button
						disabled={roles[game.user_roles[user_id]].side === "good"}
						onClick={() => quest_vote(false)}
					>
						fail
					</Button>
				</>
			) : (
				<>you voted to {game.votes[user_id][game.current_turn] ? "pass" : "fail"} the mission</>
			)}
		</>
	) : (
		<></>
	);
}
