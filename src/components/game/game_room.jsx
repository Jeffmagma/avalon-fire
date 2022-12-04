import { Button, Col, Collapse, Row, Skeleton, Steps } from "antd";
import { onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
const { Panel } = Collapse;

import db from "../../utils/firebase";
import { leave_room } from "../../utils/room";
import GameContent from "./content/game_content";
import MissionTimeline from "./mission_timeline";
import PlayerList from "./player_list";
import PlayerVotes from "./player_votes";

// end the game and disband the room
export function end_game(room_id, set_user_state) {
	const game_doc = doc(db, "rooms", room_id);
	// set everyone back to the menu, and then delete the game
	updateDoc(game_doc, { status: "menu" }).then(() => {
		set_user_state("menu");
		deleteDoc(game_doc);
	});
}

export default function GameRoom(props) {
	const { room_id, display_names, user_id, set_user_state, set_room_id } = props;
	const game_doc = useMemo(() => doc(db, "rooms", room_id));
	const [game, set_game] = useState(undefined);

	const items = [
		{ title: "first step" },
		{ title: "second step", status: "error" },
		{ title: "third step" },
		{ title: "first step" },
		{ title: "first step", status: "error" },
	];

	useEffect(() => {
		const unsubscribe = onSnapshot(game_doc, (snapshot) => {
			set_game(snapshot.data());
			if (snapshot.data().status === "menu") {
				set_room_id("");
				set_user_state("menu");
			}
		});
		return unsubscribe;
	}, []);

	return game ? (
		<>
			<Row>
				<Button onClick={() => leave_room(room_id, user_id, set_user_state, set_room_id)}>leave room</Button>
				<Button onClick={() => end_game(room_id, set_user_state)}>end game</Button>
			</Row>
			<Row>
				<Col span={12}>
					<GameContent game={game} display_names={display_names} room_id={room_id} user_id={user_id} />
				</Col>
				<Col span={6}>
					<PlayerList game={game} display_names={display_names} user_id={user_id} />
				</Col>
				<Col span={6}>
					hi {display_names[user_id]} you are {game.user_roles[user_id]}
				</Col>
			</Row>
			<Row>
				<PlayerVotes game={game} display_names={display_names} />
			</Row>
			{/*<Row>
				<MissionTimeline game={game} />
	</Row>*/}
			<Row>
				<Collapse>
					<Panel header="game data (debug)">
						{Object.entries(game).map(([key, value]) => (
							<div key={key}>
								{key} {JSON.stringify(value)} <br />
							</div>
						))}
					</Panel>
				</Collapse>
			</Row>
		</>
	) : (
		<Skeleton />
	);
}
