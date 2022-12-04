import { Button, Divider, List, Row, Col, Tooltip } from "antd";
import { onSnapshot, doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

import db from "../../utils/firebase";
import { leave_room, generate_setup_data } from "../../utils/room";
import { end_game } from "../game/game_room";

export default function Lobby(props) {
	const { room_id, set_user_state, user_id, set_room_id, display_names } = props;
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
						Lobby: {room_id} creator: {display_names[creator_id]}
					</Divider>
				</Col>
				<Col offset={8} span={8}>
					<List
						bordered
						dataSource={user_ids}
						renderItem={(user_id) => <List.Item>{display_names[user_id]}</List.Item>}
					></List>
				</Col>

				<Col offset={8} span={4} style={{ textAlign: "right" }}>
					{user_id !== creator_id ? (
						<Button
							onClick={() => leave_room(room_id, user_id, set_user_state, set_room_id)}
							style={{ background: "red", borderColor: "red" }}
						>
							leave room
						</Button>
					) : (
						<Button
							onClick={() => end_game(room_id, set_user_state)}
							style={{ background: "red", borderColor: "red" }}
						>
							disband lobby room
						</Button>
					)}
				</Col>
				<Col span={4} style={{ textAlign: "left" }}>
					{user_id === creator_id ? (
						<Tooltip title="you need at least 5 players to start the game!">
							<Button
								onClick={() => start_game(room_id)}
								type="primary"
								disabled={!(user_ids.length === 2 || user_ids.length >= 5)}
							>
								start game
							</Button>
						</Tooltip>
					) : (
						<></>
					)}
				</Col>
			</Row>
		</>
	);
}
