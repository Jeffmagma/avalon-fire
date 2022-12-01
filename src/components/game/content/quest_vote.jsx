import { List, Button } from "antd";
import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";

import db from "../../../utils/firebase";
import { players_per_mission, roles } from "../../../utils/avalon";

export default function QuestVote(props) {
	const { game, display_names, room_id, user_id } = props;
	const [voted, set_voted] = useState(false);

	function quest_vote(result) {
		const game_doc = doc(db, "rooms", room_id);
		game.quest_votes.push(result);
		// this is the last vote that needs to be cast
		// TODO maybe change all the "last votes" stuff to the creator of the room?
		if (game.quest_votes.length === game.current_team.length) {
			const quest_result =
				game.quest_votes.filter((x) => !x).length <
				(game.quest === 4 && players_per_mission.two_fail(game.players.length) ? 2 : 1);
			game.quest_results.push(quest_result);
			if (game.quest_results.filter((x) => x).length === 3) {
				updateDoc(game_doc, { game_status: "assassinate" });
			} else if (game.quest_results.filter((x) => !x).length === 3) {
				updateDoc(game_doc, { game_status: "evil_win" });
			} else {
				updateDoc(game_doc, {
					// add the result of the mission to the rest of the results, accounting for how many fails are required to fail the mission
					quest_results: game.quest_results,
					current_turn: game.current_turn + 1,
					quest: game.quest + 1,
					current_leader: (game.current_turn + 1) % game.players.length,
					current_team: [],
					quest_votes: [],
					game_status: "select",
				});
			}
		} else {
			set_voted(true);
			updateDoc(game_doc, { quest_votes: game.quest_votes });
		}
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
				<>waiting for everyone else to vote</>
			)}
		</>
	) : (
		<></>
	);
}
