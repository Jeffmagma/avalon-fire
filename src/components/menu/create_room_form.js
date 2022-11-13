import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Form, Divider, InputNumber, Popover, Checkbox, Button } from "antd";
import { UserOutlined, QuestionCircleOutlined } from "@ant-design/icons";

import db from "../../firebase";
import { roles } from "../../avalon";

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
				<Form.Item
					name="player_count"
					key="player_count"
					rules={[
						{
							validator: (_, value) =>
								value ? Promise.resolve() : Promise.reject(new Error("Set player count!")),
						},
					]}
				>
					<InputNumber
						min={2}
						max={10}
						key="player_count"
						placeholder="player count"
						addonAfter={<UserOutlined />}
					/>
				</Form.Item>
				{Object.keys(roles).map((key) => {
					if (roles[key].default == false)
						return (
							<Form.Item valuePropName="checked" key={key} name={"has_" + key} value={false}>
								<Checkbox key={key}>
									{key} {roles[key].info ? <RoleInfo info={roles[key]} /> : <></>}
								</Checkbox>
							</Form.Item>
						);
				})}
				<Form.Item key="submit">
					<Button type="primary" htmlType="submit" key="submit">
						Create
					</Button>
				</Form.Item>
			</Form>
		</>
	);
}
