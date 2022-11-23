import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import db from "./firebase";

export function shuffle(array) {
	let current_index = array.length;
	while (current_index != 0) {
		const random_index = Math.floor(Math.random() * current_index);
		current_index--;

		[array[current_index], array[random_index]] = [array[random_index], array[current_index]];
	}
}

// set the current room of the player, and set the room to contain the player
export function join_room(room_id, user_id, set_user_state, set_room_id) {
	const user_doc = doc(db, "users", user_id);
	const game_doc = doc(db, "rooms", room_id);

	updateDoc(user_doc, { current_room: room_id });
	updateDoc(game_doc, { players: arrayUnion(user_id) });
	getDoc(game_doc).then((snapshot) => {
		set_user_state(snapshot.data().status);
	});

	set_room_id(room_id);
	console.log("joined game: " + room_id);
}

// clear the current room of the player and remove the player from the list in the room
export function leave_room(room_id, user_id, set_user_state, set_room_id) {
	const user_doc = doc(db, "users", user_id);
	const game_doc = doc(db, "rooms", room_id);

	set_user_state("menu");
	set_room_id("");

	updateDoc(user_doc, { current_room: "" });
	updateDoc(game_doc, { players: arrayRemove(user_id) });

	console.log("left game: " + room_id);
}
