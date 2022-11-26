import { Button, Divider, List, Row, Col } from "antd";
import { onSnapshot, doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

import db from "../../utils/firebase";
import { leave_room, shuffle } from "../../utils/room";
import { roles } from "../../utils/avalon";

// set up the game based on the amount of players and starting data
function generate_setup_data(game) {
	// randomize the player order
	shuffle(game.players);
	// count number of good and bad special roles
	let good = 0,
		evil = 0;
	game.roles.forEach((role) => {
		console.log(role);
		if (roles[role].side === "good") {
			good++;
		} else {
			evil++;
		}
	});
	const num_players = game.players.length;
	// for testing only!
	if (num_players <= 2) {
		game.roles = ["good", "evil"];
	} else {
		const total_evil = Math.ceil(num_players / 3);
		// fill remaining slots with generic roles
		game.roles = [
			...game.roles,
			"merlin",
			...Array(total_evil - evil).fill("evil"),
			...Array(num_players - total_evil - good - 1).fill("good"),
		];
		shuffle(game.roles);
	}
	const user_roles = Object.fromEntries(game.players.map((_, i) => [game.players[i], game.roles[i]]));
	console.log(user_roles);
	const user_data = Object.fromEntries(
		Object.entries(user_roles).map(([user, role]) => [
			user,
			Object.fromEntries(
				Object.entries(user_roles).map(([role_user, user_role]) => [
					role_user,
					roles[role].view_role(user_role),
				])
			),
		])
	);
	// TODO
	console.log(user_data);
	// return the new data
	return {
		mission: 0,
		players: game.players,
		user_data: user_data,
		user_roles: user_roles,
		status: "game",
	};
}

function start_game(room_id) {
	const room_doc = doc(db, "rooms", room_id);
	getDoc(room_doc).then((data) => {
		console.log(data);
		const setup_data = generate_setup_data(data.data());
		updateDoc(room_doc, setup_data);
	});
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
						renderItem={(user_id) => <List.Item>{props.display_names[user_id]}</List.Item>}
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
