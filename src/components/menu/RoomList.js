import { useState, useEffect } from "react";
import { query, collection, orderBy, onSnapshot, doc, updateDoc, arrayUnion } from "firebase/firestore";
import db from "../../firebase";
import { List, Row, Col, Button } from "antd";

// set the current room of the player, and set the
function join_game(game_id, player_id) {
	const user_doc = doc(db, "users", player_id);
	const game_doc = doc(db, "rooms", game_id);

	updateDoc(user_doc, { current_room: game_id });
	updateDoc(game_doc, { players: arrayUnion(player_id) });

	console.log("joined game: " + game_id);
}

function render_room_item(room, user_id, set_room_id) {
	return (
		<List.Item>
			<Row style={{ width: "100%" }} align="middle">
				<Col span={6}>ID:{room.id}</Col>
				<Col span={12}>/{room.data.players.length}</Col>
				<Col flex="auto">
					<Button
						onClick={() => {
							join_game(room.id, user_id);
							set_room_id(room.id);
						}}
					>
						join
					</Button>
				</Col>
			</Row>
		</List.Item>
	);
}

export default function RoomList(props) {
	const [rooms, setRooms] = useState([]);
	useEffect(() => {
		const games_by_created_desc = query(collection(db, "rooms"), orderBy("created", "desc"));
		onSnapshot(games_by_created_desc, (snapshot) => {
			setRooms(
				snapshot.docs.map((doc) => ({
					id: doc.id,
					data: doc.data(),
				}))
			);
		});
	}, []);

	return (
		<List
			bordered
			dataSource={rooms}
			renderItem={(room) => {
				return render_room_item(room, props.user_id, props.set_room_id);
			}}
		/>
	);

	/*return (
		<div>
			test:
			{rooms.map((room) => {
				return (
					<div key={room.id}>
						id: {room.id} players: {room.data.players.length} created by: {room.data.creator}
						<button
							onClick={() => {
								join_game(room.id, "random_name_here");
								props.sgid(room.id);
							}}
						>
							join
						</button>
					</div>
				);
			})}
		</div>
	);*/
}
