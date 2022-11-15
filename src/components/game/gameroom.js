import { Button } from "antd";
import { onSnapshot, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import db from "../../firebase";

export default function GameRoom(props) {
	const [game, set_game] = useState({});

	useEffect(() => {
		const game_doc = doc(db, "rooms", props.room_id);
		onSnapshot(game_doc, (doc) => {
			set_game(doc.data());
		});
	});

	return (
		<>
			this is a game<Button onClick={() => props.set_user_state("menu")}>end game</Button>
			<br /> {JSON.stringify(game)}
		</>
	);
}
