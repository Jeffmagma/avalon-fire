import { Button, Divider, List, Row, Col } from "antd";
import { onSnapshot, doc } from "firebase/firestore";
import { useEffect, useState } from "react";

import db from "../../firebase";
import { leave_room } from "../../join_leave";

export default function Lobby(props) {
	const [user_ids, set_user_ids] = useState([]);

	useEffect(() => {
		let game_doc = doc(db, "rooms", props.room_id);
		onSnapshot(game_doc, (snapshot) => {
			console.log(snapshot);
			set_user_ids(snapshot.data().players);
		});
	}, [props.room_id]);

	return (
		<>
			<Row gutter={[0, 16]}>
				<Col offset={8} span={8}>
					<Divider>Lobby: {props.room_id}</Divider>
				</Col>
				<Col offset={8} span={8}>
					<List
						bordered
						dataSource={user_ids}
						renderItem={(user_id) => {
							return props.display_names[user_id];
						}}
					></List>
				</Col>
				<Col offset={8} span={8} style={{ textAlign: "center" }}>
					<Button
						type="primary"
						onClick={() => leave_room(props.room_id, props.user_id, props.set_user_state)}
					>
						leave game
					</Button>
				</Col>
			</Row>
		</>
	);
}
