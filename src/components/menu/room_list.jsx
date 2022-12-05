import { useState, useEffect, useRef } from "react";
import { query, collection, orderBy, onSnapshot } from "firebase/firestore";
import { List, Row, Col, Button, Divider, Collapse } from "antd";
import { RightOutlined } from "@ant-design/icons";
const { Panel } = Collapse;

import db from "../../utils/firebase";
import { join_room } from "../../utils/room";

export default function RoomList(props) {
	const { user_id, set_room_id, set_user_state, display_names } = props;

	const [rooms, set_rooms] = useState([]);
	const [expanded, set_expanded] = useState([]);

	useEffect(() => {
		const games_by_created_desc = query(collection(db, "rooms"), orderBy("created", "desc"));
		const unsubscribe = onSnapshot(games_by_created_desc, (snapshot) => {
			set_rooms(
				snapshot.docs.map((doc) => ({
					id: doc.id,
					data: doc.data(),
				}))
			);
		});
		return unsubscribe;
	}, []);

	function render_room_item(room) {
		const time_created = new Date(room.data.created * 1000).toLocaleTimeString("en-us", {
			hour: "2-digit",
			minute: "2-digit",
		});

		return (
			<Panel
				key={room.id}
				showArrow={false}
				header={
					<Row style={{ width: "100%" }} align="middle">
						<Col span={1}>
							<RightOutlined
								style={{
									transform: expanded.includes(room.id) ? "rotate(90deg)" : "",
									transition: "transform 200ms ease",
								}}
							/>
						</Col>
						<Col span={15}>
							created by {display_names[room.data.creator]} at {time_created}
						</Col>
						<Col span={4}>players:{room.data.players.length}</Col>
						<Col span={4} style={{ textAlign: "right" }}>
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
				}
			>
				<Row>players: {JSON.stringify(room.data.players.map((x) => display_names[x]))}</Row>
				<Row>roles: {JSON.stringify(room.data.roles)}</Row>
			</Panel>
		);
	}

	return (
		<>
			<Divider orientation="left">Join Room</Divider>
			<Collapse onChange={set_expanded}>{rooms.map((room) => render_room_item(room))}</Collapse>
		</>
	);
}
