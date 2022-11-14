import { Button, Divider, List } from "antd";
import { onSnapshot, doc } from "firebase/firestore";
import { useEffect, useState, useRef } from "react";

import db from "../../firebase";
import { leave_room } from "../../join_leave";

export default function Lobby(props) {
	const room_id = useRef(props.room_id);
	const [user_ids, set_user_ids] = useState([]);

	useEffect(() => {
		let game_doc = doc(db, "rooms", props.room_id);
		onSnapshot(game_doc, (snapshot) => {
			console.log(snapshot);
			set_user_ids(snapshot.data().players);
		});
	}, []);

	return (
		<>
			<Divider>Lobby: {props.room_id}</Divider>
			<List
				bordered
				dataSource={user_ids}
				renderItem={(user_id) => {
					return props.display_names[user_id];
				}}
			></List>
			<Button onClick={() => leave_room(props.room_id, props.user_id, props.set_user_state)}>leave game</Button>
		</>
	);
}
