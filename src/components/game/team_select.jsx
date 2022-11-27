import { Checkbox, Form, Row, Button } from "antd";
import { useForm } from "antd/es/form/Form";
import { useState } from "react";

// suggest a team, team is an array of player ids
function suggest_team(room_id, team) {
	const game_doc = doc(db, "rooms", room_id);
	updateDoc(game_doc, { status: "suggest_team", current_team: team });
}

export default function TeamSelect(props) {
	const { game, display_names } = props;

	const [form] = useForm();
	const [selected, set_selected] = useState([]);

	return (
		<Form form={form} name="select_team" onFinish={console.log}>
			<Form.Item name="players">
				<Checkbox.Group onChange={(selected) => set_selected(selected)}>
					{game.players.map((id) => (
						<Row>
							<Checkbox value={id} disabled={!selected.includes(id) && selected.length >= 1}>
								{display_names[id]}
							</Checkbox>
						</Row>
					))}
				</Checkbox.Group>
			</Form.Item>
			<Form.Item key="submit">
				<Button type="primary" htmlType="submit" key="submit">
					Select
				</Button>
			</Form.Item>
		</Form>
	);
}
