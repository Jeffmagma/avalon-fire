import { Button, List } from "antd";
import { doc, updateDoc } from "firebase/firestore";
import db from "../../../utils/firebase";

export default function TeamVote(props) {
	const { game, display_names, room_id, user_id } = props;

	function team_vote(result) {
		const game_doc = doc(db, "rooms", room_id);
		game.team_votes.push({ player: user_id, vote: result });
		// if this is the last vote that needs to be counted, check if the next leader suggests a team or the quest starts
		if (game.team_votes.length === game.players.length) {
			// add all votes to players' data
			updateDoc(
				game_doc,
				Object.fromEntries(
					game.team_votes.map((vote) => [
						"votes." + vote.player + "." + game.quest,
						[...game.votes[vote.player][game.quest], vote.vote],
					])
				)
			);
			// more than half the players voted to accept the team
			if (game.team_votes.filter((vote) => vote.vote).length > game.players.length / 2) {
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
	}

	return (
		<>
			<List dataSource={game.current_team} renderItem={(x) => <List.Item>{display_names[x]}</List.Item>} />
			{!game.team_votes.some((vote) => vote.player === user_id) ? (
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
