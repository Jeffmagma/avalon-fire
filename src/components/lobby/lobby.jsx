import { Button, Divider, List, Row, Col } from "antd";
import { onSnapshot, doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

import db from "../../utils/firebase";
import { leave_room, generate_setup_data } from "../../utils/room";
import { end_game } from "../game/game_room";

export default function Lobby(props) {
	const { room_id, set_user_state } = props;
	const [user_ids, set_user_ids] = useState([]);
	const [creator_id, set_creator_id] = useState("");

	useEffect(() => {
		const game_doc = doc(db, "rooms", room_id);
		getDoc(game_doc).then((doc) => set_creator_id(doc.data().creator));
		const unsubscribe = onSnapshot(game_doc, (snapshot) => {
			if (["menu", "game"].includes(snapshot.data().status)) {
				set_user_state(snapshot.data().status);
			} else {
				set_user_ids(snapshot.data().players);
			}
		});

		return unsubscribe;
	}, []);

	function start_game() {
		const room_doc = doc(db, "rooms", room_id);
		getDoc(room_doc).then((data) => {
			const setup_data = generate_setup_data(data.data());
			updateDoc(room_doc, setup_data);
		});
	}

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
						renderItem={(user_id) => <List.Item>{props.display_names[user_id]}</List.Item>}
					></List>
				</Col>

				<Col offset={8} span={4} style={{ textAlign: "right" }}>
					{props.user_id !== creator_id ? (
						<Button
							onClick={() =>
								leave_room(props.room_id, props.user_id, props.set_user_state, props.set_room_id)
							}
							style={{ background: "red", borderColor: "red" }}
						>
							leave game
						</Button>
					) : (
						<Button
							onClick={() => end_game(props.room_id, props.set_user_state)}
							style={{ background: "red", borderColor: "red" }}
						>
							disband lobby room
						</Button>
					)}
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
