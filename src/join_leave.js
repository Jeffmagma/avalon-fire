import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import db from "./firebase";

// set the current room of the player, and set the room to contain the player
export function join_room(room_id, user_id, set_user_state) {
	const user_doc = doc(db, "users", user_id);
	const game_doc = doc(db, "rooms", room_id);

	updateDoc(user_doc, { current_room: room_id });
	updateDoc(game_doc, { players: arrayUnion(user_id) });

	set_user_state("lobby");
	console.log("joined game: " + room_id);
}

// clear the current room of the player and remove the player from the list in the room
export function leave_room(room_id, user_id, set_user_state) {
	const user_doc = doc(db, "users", user_id);
	const game_doc = doc(db, "rooms", room_id);

	updateDoc(user_doc, { current_room: "" });
	updateDoc(game_doc, { players: arrayRemove(user_id) });

	set_user_state("menu");
	console.log("left game: " + room_id);
}
