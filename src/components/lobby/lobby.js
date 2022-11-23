import { Button, Divider, List, Row, Col } from "antd";
import { onSnapshot, doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

import db from "../../firebase";
import { leave_room, shuffle } from "../../join_leave";

// set up the game based on the amount of players and starting data
function setup_game(game) {
	const players = game.players;
	for (let i = 0; i < 5; i++) {
		shuffle(players);
		console.log(players);
	}
}

function start_game(room_id) {
	const room_doc = doc(db, "rooms", room_id);
	getDoc(doc).then((data) => {
		setup_game(data.data());
	});
	updateDoc(room_doc, { status: "game" });
}

export default function Lobby(props) {
	const [user_ids, set_user_ids] = useState([]);
	const [creator_id, set_creator_id] = useState("");

	useEffect(() => {
		const game_doc = doc(db, "rooms", props.room_id);
		getDoc(game_doc).then((doc) => set_creator_id(doc.data().creator));
		const unsubscribe = onSnapshot(game_doc, (snapshot) => {
			console.log(snapshot.data().status);
			if (["menu", "game"].includes(snapshot.data().status)) {
				props.set_user_state(snapshot.data().status);
			} else {
				set_user_ids(snapshot.data().players);
			}
		});

		return unsubscribe;
	}, [props]);

	return (
		<>
			<Row gutter={[2, 16]}>
				<Col offset={8} span={8}>
					<Divider>
						Lobby: {props.room_id} creator: {props.display_names[creator_id]}
					</Divider>
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

				<Col offset={8} span={4} style={{ textAlign: "right" }}>
					{props.user_id !== creator_id ? (
						<Button
							onClick={() =>
								leave_room(props.room_id, props.user_id, props.set_user_state, props.set_room_id)
							}
							style={{ background: "red", borderColor: "red" }}
						>
							leave game
						</Button>
					) : (
						<Button
							onClick={() => console.log("disband room")}
							style={{ background: "red", borderColor: "red" }}
						>
							disband lobby room
						</Button>
					)}
				</Col>
				<Col span={4} style={{ textAlign: "left" }}>
					<Button
						onClick={() => start_game(props.room_id)}
						type="primary"
						disabled={props.user_id !== creator_id}
					>
						start game
					</Button>
				</Col>
			</Row>
		</>
	);
}
