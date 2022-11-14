import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Form, Divider, Popover, Checkbox, Button } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

import db from "../../firebase";
import { roles } from "../../avalon";
import { join_room } from "../../join_leave";

function create_game(creator, form_data) {
	console.log(form_data);
	let data = {};
	data.roles = ["morgana"];
	addDoc(collection(db, "rooms"), {
		creator: creator,
		created: serverTimestamp(),
		players: [],
		roles: data.roles,
		status: "lobby",
		turn: 0,
		votes: { 0: [true, false], 1: [false, true] },
	}).then((doc) => {
		join_room(creator, doc.id);
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
					create_game(props.user_id, data);
				}}
			>
				{Object.keys(roles)
					.filter((key) => !roles[key].default)
					.map((key) => (
						<Form.Item valuePropName="checked" key={key} name={"has_" + key} value={false}>
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
