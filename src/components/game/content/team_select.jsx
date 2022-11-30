import { Checkbox, Form, Row, Button } from "antd";
import { useForm } from "antd/es/form/Form";
import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";

import db from "../../../utils/firebase";

export default function TeamSelect(props) {
	const { game, display_names, room_id, user_id } = props;

	const [form] = useForm();
	const [selected, set_selected] = useState([]);

	// suggest a team, team is an array of player ids
	function suggest_team(form_data) {
		const game_doc = doc(db, "rooms", room_id);
		updateDoc(game_doc, { game_status: "vote", current_team: form_data.players });
	}

	return game.players[game.current_leader] == user_id ? (
		<Form form={form} onFinish={suggest_team}>
			<Form.Item
				name="players"
				rules={[
					{
						validator: (_, value) =>
							value.length === 1
								? Promise.resolve()
								: Promise.reject(new Error("You must select the right amount of players! (1)")),
					},
				]}
			>
				<Checkbox.Group onChange={set_selected}>
					{game.players.map((id) => (
						<Row key={id}>
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
	) : (
		<>waiting for {display_names[game.players[game.current_leader]]} to select a team</>
	);
}
