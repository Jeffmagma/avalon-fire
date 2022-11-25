import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Form, Divider, Checkbox, Button } from "antd";
import RoleInfo from "./roleinfo";

import db from "../../utils/firebase";
import { roles2 } from "../../utils/avalon";
import { join_room } from "../../utils/join_leave";

// create a game
function create_game(creator, form_data, set_user_state, set_room_id) {
	let roles = [];
	for (const key in form_data) {
		if (form_data[key]) {
			roles.push(key);
		}
	}
	console.log("creating new game with roles:" + roles);
	addDoc(collection(db, "rooms"), {
		creator: creator, // who created the game
		created: serverTimestamp(), // when it was made (sorted by this)
		players: [], // list of user ids
		roles: roles, // the extra roles in the game
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
				{Object.keys(roles2)
					.filter((key) => roles2[key].optional)
					.map((key) => (
						<Form.Item valuePropName="checked" key={key} name={key} initialValue={false}>
							<Checkbox key={key}>
								{key} <RoleInfo info={roles2[key]} />
							</Checkbox>
						</Form.Item>
					))}
				<Form.Item key="submit">
					<Button type="primary" htmlType="submit" key="submit">
						Create
					</Button>
				</Form.Item>
			</Form>
		</>
	);
}
