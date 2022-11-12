import { useState, useEffect } from "react";
import { query, collection, orderBy, onSnapshot, doc, updateDoc, arrayUnion } from "firebase/firestore";
import db from "../firebase";

function join_game(id, player_name) {
	const game_doc = doc(db, "games", id);
	updateDoc(game_doc, { players: arrayUnion(player_name) });
	console.log("joined game: " + id);
}

export default function RoomList(props) {
	const [rooms, setRooms] = useState([]);
	useEffect(() => {
		const games_by_created_desc = query(collection(db, "games"), orderBy("created", "desc"));
		onSnapshot(games_by_created_desc, (snapshot) => {
			setRooms(
				snapshot.docs.map((doc) => ({
					id: doc.id,
					data: doc.data(),
				}))
			);
		});
	}, []);

	return (
		<div>
			test:
			{rooms.map((room) => {
				return (
					<div key={room.id}>
						id: {room.id} players: {room.data.players.length} created by: {room.data.creator}
						<button
							onClick={() => {
								join_game(room.id, "random_name_here");
								props.sgid(room.id);
							}}
						>
							join
						</button>
					</div>
				);
			})}
		</div>
	);
}
