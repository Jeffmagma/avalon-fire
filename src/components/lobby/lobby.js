import { Button, Divider, List, Row, Col } from "antd";
import { onSnapshot, doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

import db from "../../firebase";
import { leave_room } from "../../join_leave";

function start_game(room_id) {
	const room_doc = doc(db, "rooms", room_id);
	updateDoc(room_doc, { status: "game" });
}

export default function Lobby(props) {
	const [user_ids, set_user_ids] = useState([]);
	const [creator_id, set_creator_id] = useState("");

	useEffect(() => {
		let game_doc = doc(db, "rooms", props.room_id);
		getDoc(game_doc).then((doc) => set_creator_id(doc.data().creator));
		onSnapshot(game_doc, (snapshot) => {
			console.log(snapshot.data().status);
			if (["menu", "game"].includes(snapshot.data().status)) {
				props.set_user_state(snapshot.data().status);
			} else {
				set_user_ids(snapshot.data().players);
			}
		});
	}, [props]);

	return (
		<>
			<Row gutter={[2, 16]}>
				<Col offset={8} span={8}>
					<Divider>
						Lobby: {props.room_id} creator: {props.display_names[creator_id]}
					</Divider>
				</Col>
				<Col offset={8} span={8}>
					<List
						bordered
						dataSource={user_ids}
						renderItem={(user_id) => {
							return props.display_names[user_id];
						}}
					></List>
				</Col>
				<Col offset={8} span={4} style={{ textAlign: "right" }}>
					<Button
						onClick={() => leave_room(props.room_id, props.user_id, props.set_user_state)}
						style={{ background: "red", borderColor: "red" }}
					>
						leave game
					</Button>
				</Col>
				<Col span={4} style={{ textAlign: "left" }}>
					<Button
						onClick={() => start_game(props.room_id)}
						type="primary"
						disabled={props.user_id !== creator_id}
					>
						start game
					</Button>
				</Col>
			</Row>
		</>
	);
}
