import { Button, Checkbox, Skeleton } from "antd";
import { onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";

import db from "../../utils/firebase";
import { leave_room } from "../../utils/room";
import TeamSelect from "./team_select";
import TeamVote from "./team_vote";

// end the game and disband the room
export function end_game(room_id) {
	const game_doc = doc(db, "rooms", room_id);
	// set everyone back to the menu, and then delete the game
	updateDoc(game_doc, { status: "menu" }).then(() => deleteDoc(game_doc));
}

export default function GameRoom(props) {
	const { room_id } = props;
	const game_doc = useMemo(() => doc(db, "rooms", room_id));
	const [game, set_game] = useState(undefined);

	// go to the next turn
	function next_turn() {
		updateDoc(game_doc, {
			current_turn: game.current_turn + 1,
			current_player: (game.current_turn + 1) % game.players.length,
		});
	}

	useEffect(() => {
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
					{game.players[game.current_player] == props.user_id ? (
						<Button onClick={() => next_turn(game, props.room_id)}>next players turn</Button>
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
					<TeamVote
						game={game}
						display_names={props.display_names}
						room_id={props.room_id}
						user_id={props.user_id}
					/>
					<br /> {JSON.stringify(game.user_data[props.user_id])}
					<br />{" "}
					{Object.entries(game).map(([key, value]) => (
						<>
							{key} {JSON.stringify(value)} <br />
						</>
					))}
				</>
			) : (
				<Skeleton />
			)}
		</>
	);
}
