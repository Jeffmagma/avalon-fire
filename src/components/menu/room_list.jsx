import { useState, useEffect } from "react";
import { query, collection, orderBy, onSnapshot } from "firebase/firestore";
import { List, Row, Col, Button, Divider } from "antd";

import db from "../../utils/firebase";
import { join_room } from "../../utils/room";

function render_room_item(room, user_id, set_room_id, set_user_state) {
	const date = new Date(room.data.created * 1000);

	return (
		<List.Item>
			<Row style={{ width: "100%" }} align="middle">
				<Col span={12}>
					ID:{room.id} time:{date.getHours()}:{date.getMinutes()}
				</Col>
				<Col span={6}>players:{room.data.players.length}</Col>
				<Col span={6}>
					{room.data.status === "game" ? (
						<Button disabled>in game</Button>
					) : (
						<Button
							onClick={() => {
								join_room(room.id, user_id, set_user_state, set_room_id);
							}}
						>
							join
						</Button>
					)}
				</Col>
			</Row>
		</List.Item>
	);
}

export default function RoomList(props) {
	const [rooms, setRooms] = useState([]);
	useEffect(() => {
		const games_by_created_desc = query(collection(db, "rooms"), orderBy("created", "desc"));
		const unsubscribe = onSnapshot(games_by_created_desc, (snapshot) => {
			setRooms(
				snapshot.docs.map((doc) => ({
					id: doc.id,
					data: doc.data(),
				}))
			);
		});
		return unsubscribe;
	}, []);

	return (
		<>
			<Divider orientation="left">Join Room</Divider>
			<List
				bordered
				dataSource={rooms}
				renderItem={(room) => {
					return render_room_item(room, props.user_id, props.set_room_id, props.set_user_state);
				}}
			/>
		</>
	);
}
