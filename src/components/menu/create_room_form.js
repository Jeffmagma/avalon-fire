import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Form, Divider, Popover, Checkbox, Button } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

import db from "../../firebase";
import { roles } from "../../avalon";
import { join_room } from "../../join_leave";

// create a game
function create_game(creator, form_data, set_user_state, set_room_id) {
	let roles = [];
	for (const key in form_data) {
		if (form_data[key]) {
			roles.push(key.substring(4));
		}
	}
	console.log("creating new game with roles:" + roles);
	addDoc(collection(db, "rooms"), {
		creator: creator, // who created the game
		created: serverTimestamp(), // when it was made (sorted by this)
		players: [], // list of user ids
		roles: roles, // the extra roles in the game
		status: "lobby", // the game state to broadcast to people after they join the lobby (menu, lobby, game)
		game_status: "lobby", // the stage of the game itself
		mission: 1, // avalon mission (out of 5)
		user_turn: 0, // index of the user who's turn it is to pick a mission
		current_mission: [], // the currently suggested team
		fails: 0, // how many fails so far (5 = evil win)
		votes: {}, // map of user id to their votes
	}).then((doc) => {
		join_room(doc.id, creator, set_user_state, set_room_id);
	});
}

function RoleInfo(props) {
	let role = props.info;
	return (
		<Popover
			placement="right"
			content={
				<>
					{role.info.map((x) => (
						<div key={x}>
							{x}
							<br />
						</div>
					))}
				</>
			}
			title={role.good ? "good" : "evil"}
		>
			<QuestionCircleOutlined />
		</Popover>
	);
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
				{Object.keys(roles)
					.filter((key) => !roles[key].default)
					.map((key) => (
						<Form.Item valuePropName="checked" key={key} name={"has_" + key} initialValue={false}>
							<Checkbox key={key}>
								{key} {roles[key].info ? <RoleInfo info={roles[key]} /> : <></>}
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
