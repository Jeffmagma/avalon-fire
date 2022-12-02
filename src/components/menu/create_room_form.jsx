import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Form, Divider, Checkbox, Button, Row, Col, Space } from "antd";
import RoleInfo from "./roleinfo";

import db from "../../utils/firebase";
import { roles } from "../../utils/avalon";
import { join_room } from "../../utils/room";
import { useState } from "react";

export default function CreateRoomForm(props) {
	const { user_id, set_user_state, set_room_id } = props;

	const [selected_roles, set_selected_roles] = useState([]);

	// create a game
	function create_game() {
		console.log("creating new game with roles:" + selected_roles);
		addDoc(collection(db, "rooms"), {
			creator: user_id, // who created the game
			created: serverTimestamp(), // when it was made (sorted by this)
			players: [], // list of user ids
			roles: selected_roles, // the extra roles in the game
			status: "lobby", // the game state to broadcast to people in the room (menu, lobby, game)
			game_status: "lobby", // the stage of the game itself
		}).then((doc) => {
			join_room(doc.id, user_id, set_user_state, set_room_id);
		});
	}

	return (
		<>
			<Divider orientation="left">Create Room</Divider>
			<Space direction="vertical">
				<Checkbox.Group onChange={set_selected_roles}>
					<Row gutter={[0, 10]}>
						{Object.keys(roles)
							.filter((key) => roles[key].optional)
							.map((key) => (
								<Col key={key} span={24}>
									<Checkbox value={key}>
										{key} <RoleInfo info={roles[key]} />
									</Checkbox>
								</Col>
							))}
					</Row>
				</Checkbox.Group>
				<Button type="primary" onClick={create_game}>
					Create
				</Button>
			</Space>
		</>
	);
}
