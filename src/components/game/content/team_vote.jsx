import { Button, List } from "antd";
import { doc, updateDoc } from "firebase/firestore";
import db from "../../../utils/firebase";

export default function TeamVote(props) {
	const { game, display_names, room_id, user_id } = props;

	function team_vote(result) {
		const game_doc = doc(db, "rooms", room_id);
		game.team_votes.push(result);
		// if this is the last vote that needs to be counted, check if the next leader suggests a team or the quest starts
		if (game.team_votes.length === game.players.length) {
			// more than half the players voted to accept the team
			if (game.team_votes.filter((x) => x).length > game.players.length / 2) {
				// start the quest
				updateDoc(game_doc, {
					team_votes: [],
					game_status: "quest",
				});
			} else {
				if (game.team_suggestion == 4) {
					// if there have already been 4 rejected teams, evil win
					updateDoc(game_doc, { game_status: "evil_win" });
				} else {
					// if not, go to the next leader
					updateDoc(game_doc, {
						current_turn: game.current_turn + 1,
						current_leader: (game.current_turn + 1) % game.players.length,
						current_team: [],
						team_votes: [],
						team_suggestion: game.team_suggestion + 1,
						game_status: "select",
					});
				}
			}
		} else {
			updateDoc(game_doc, { team_votes: game.team_votes });
		}
		updateDoc(game_doc, {
			// cannot use array union here cause it only adds unique values
			["votes." + user_id + "." + game.quest]: [...game.votes[user_id][game.quest], result],
		});
	}

	return (
		<>
			<List dataSource={game.current_team} renderItem={(x) => <List.Item>{display_names[x]}</List.Item>} />
			{/* if the total amount of votes cast by this player is equal to the amount of turns that have passed*/}
			{Object.values(game.votes[user_id]).reduce((accumulator, current) => accumulator + current.length, 0) ===
			game.current_turn ? (
				<>
					<Button onClick={() => team_vote(true)}>approve</Button>
					<Button onClick={() => team_vote(false)}>deny</Button>
				</>
			) : (
				<>
					you voted to {game.votes[user_id][game.current_turn] ? "approve" : "reject"} the mission
					{JSON.stringify(game.votes[user_id])}
				</>
			)}
		</>
	);
}
