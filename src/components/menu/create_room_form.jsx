import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Form, Divider, Checkbox, Button, Row, Col } from "antd";
import RoleInfo from "./roleinfo";

import db from "../../utils/firebase";
import { roles } from "../../utils/avalon";
import { join_room } from "../../utils/room";

// create a game
function create_game(creator, form_data, set_user_state, set_room_id) {
	console.log(form_data);
	console.log("creating new game with roles:" + form_data.roles);
	addDoc(collection(db, "rooms"), {
		creator: creator, // who created the game
		created: serverTimestamp(), // when it was made (sorted by this)
		players: [], // list of user ids
		roles: form_data.roles, // the extra roles in the game
		status: "lobby", // the game state to broadcast to people in the room (menu, lobby, game)
		game_status: "lobby", // the stage of the game itself
	}).then((doc) => {
		join_room(doc.id, creator, set_user_state, set_room_id);
	});
}

export default function CreateRoomForm(props) {
	const [form] = Form.useForm();
	return (
		<>
			<Divider orientation="left">Create Room</Divider>
			<Form
				form={form}
				name="new_game"
				onFinish={(data) => {
					create_game(props.user_id, data, props.set_user_state, props.set_room_id);
				}}
			>
				<Form.Item name="roles" initialValue={[]}>
					<Checkbox.Group>
						{Object.keys(roles)
							.filter((key) => roles[key].optional)
							.map((key) => (
								<Row>
									<Checkbox key={key} value={key}>
										{key} <RoleInfo info={roles[key]} />
									</Checkbox>
								</Row>
							))}
					</Checkbox.Group>
				</Form.Item>

				<Form.Item key="submit">
					<Button type="primary" htmlType="submit" key="submit">
						Create
					</Button>
				</Form.Item>
			</Form>
		</>
	);
}
