import { Button, Checkbox, Skeleton } from "antd";
import { onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

import db from "../../utils/firebase";
import { leave_room } from "../../utils/room";
import TeamSelect from "./team_select";
import TeamVote from "./team_vote";

function next_mission(game, room_id) {
	const game_doc = doc(db, "rooms", room_id);
	updateDoc(game_doc, { mission: (game.mission + 1) % game.players.length });
}

// end the game and disband the room
export function end_game(room_id) {
	const game_doc = doc(db, "rooms", room_id);
	// set everyone back to the menu, and then delete the game
	updateDoc(game_doc, { status: "menu" }).then(() => deleteDoc(game_doc));
}

export default function GameRoom(props) {
	const [game, set_game] = useState(undefined);

	useEffect(() => {
		const game_doc = doc(db, "rooms", props.room_id);
		const unsubscribe = onSnapshot(game_doc, (doc) => {
			set_game(doc.data());
			if (doc.data().status === "menu") {
				props.set_room_id("");
				props.set_user_state("menu");
			}
		});
		return unsubscribe;
	});

	return (
		<>
			{game ? (
				<>
					this is a game
					{game.players[game.mission] == props.user_id ? (
						<Button onClick={() => next_mission(game, props.room_id)}>next mission</Button>
					) : (
						<></>
					)}
					<Button
						onClick={() =>
							leave_room(props.room_id, props.user_id, props.set_user_state, props.set_room_id)
						}
					>
						leave room
					</Button>
					<Button onClick={() => end_game(props.room_id)}>end game</Button>
					<TeamSelect game={game} display_names={props.display_names} room_id={props.room_id} />
					<TeamVote game={game} display_names={props.display_names} />
					<br /> {JSON.stringify(game.user_data[props.user_id])}
				</>
			) : (
				<Skeleton />
			)}
		</>
	);
}
