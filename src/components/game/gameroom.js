import { Button } from "antd";
import { onSnapshot, doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import db from "../../firebase";
import { leave_room } from "../../join_leave";

function next_mission(game, room_id) {
	const game_doc = doc(db, "rooms", room_id);
	updateDoc(game_doc, { mission: game.mission + 1 });
}

export default function GameRoom(props) {
	const [game, set_game] = useState({});

	useEffect(() => {
		const game_doc = doc(db, "rooms", props.room_id);
		const unsubscribe = onSnapshot(game_doc, (doc) => {
			set_game(doc.data());
		});
		return unsubscribe;
	});

	return (
		<>
			this is a game
			<Button onClick={() => next_mission(game, props.room_id)}>next mission</Button>
			<Button onClick={() => leave_room(props.room_id, props.user_id, props.set_user_state, props.set_room_id)}>
				end game
			</Button>
			<br /> {JSON.stringify(game)}
		</>
	);
}
