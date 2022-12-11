import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Divider, Checkbox, Button, Row, Col, Space } from "antd";
import { useRef } from "react";
import RoleInfo from "./roleinfo";

import db from "../../utils/firebase";
import { roles } from "../../utils/avalon";
import { join_room } from "../../utils/room";
import { useState } from "react";

export default function CreateRoomForm({ user_id, set_user_state, set_room_id }) {
	const [selected_roles, set_selected_roles] = useState([]);
	const use_lady = useRef();
	const use_plot = useRef();
	const use_targeting = useRef();

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
				<Checkbox ref={use_targeting} disabled>
					targeting{" "}
					<RoleInfo
						info={{
							info: "allows the leader to select which of the five quests to go on",
						}}
					/>
				</Checkbox>
				<Checkbox ref={use_plot} disabled>
					plot cards{" "}
					<RoleInfo
						info={{
							info: "plot cards are distributed by the leader at the start of every round",
							helps: "good",
						}}
					/>
				</Checkbox>
				<Checkbox ref={use_lady} disabled>
					lady of the lake{" "}
					<RoleInfo
						info={{
							info: "allows a player to see another players role at the start of the last three rounds",
							helps: "good",
						}}
					/>
				</Checkbox>
				<Button type="primary" onClick={create_game}>
					Create
				</Button>
			</Space>
		</>
	);
}
