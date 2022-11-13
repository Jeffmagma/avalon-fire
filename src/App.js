import {
	collection,
	onSnapshot,
	doc,
	addDoc,
	serverTimestamp,
	updateDoc,
	arrayRemove,
	getDoc,
	setDoc,
} from "firebase/firestore";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import React, { useState, useEffect } from "react";

import "antd/dist/antd.dark.min.css";

import Menu from "./components/menu/menu";
import db from "./firebase";

function create_game(creator, data) {
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

function leave_game(id, player_name) {
	const game_doc = doc(db, "games", id);
	updateDoc(game_doc, { players: arrayRemove(player_name) });
	console.log("left game: " + id);
}

function CreateGame(props) {
	return (
		<button
			onClick={() => {
				create_game(props.user, { roles: ["morgana"] });
			}}
		>
			create game
		</button>
	);
}

function Game(props) {
	const id = props.id;
	const [data, setData] = useState({});
	useEffect(() => {
		onSnapshot(doc(db, "games", id), (doc) => {
			console.log(doc.data());
			setData(doc.data());
		});
	}, [id]);
	return (
		<>
			{JSON.stringify(data)}
			<button
				onClick={() => {
					updateDoc(doc(db, "games", id), {
						players: arrayRemove("player_name"),
					});
					props.sgid("");
				}}
			>
				return to lobby
			</button>
		</>
	);
}
const auth = getAuth();

function GameRoom(props) {}

function Avalon() {
	const [room_id, set_room_id] = useState("");
	const [user_id, set_user_id] = useState("");
	const [user_state, set_user_state] = useState("");
	const [display_name, set_display_name] = useState("");

	// when the page first loads, create a user id
	useEffect(() => {
		set_room_id("");
		// set up a hook for when the sign in works
		onAuthStateChanged(auth, (user) => {
			// when they sign in
			if (user) {
				// set the id stored in the app
				set_user_id(user.uid);
				console.log("user:" + user.uid);

				// get their info from the database
				let user_info = doc(db, "users", user.uid);
				getDoc(user_info).then((snapshot) => {
					if (snapshot.exists()) {
						// if the user already exists, get the display name from the server
						console.log("found name");
						const data = snapshot.data();
						set_display_name(data.display_name);
						// if they are already in a game, put them into that room automatically
						if (data.current_room !== "") {
							set_room_id(data.current_room);
						}
					} else {
						// add a user to the database that isn't currently in a game
						console.log("added user");
						setDoc(user_info, { current_room: "", display_name: user.uid });
						set_display_name(user.uid);
					}
				});
			}
		});
		// attempt an "anonymous" sign in
		signInAnonymously(auth)
			.then(() => {
				console.log("successfully signed in");
			})
			.catch((error) => {
				console.err("error signing in:" + error.code + error.message);
			});
	}, []);

	// if we are not in a room, display the menu, if we are, display the game
	// TODO: three states (lobby)
	return room_id === "" ? (
		<Menu
			display_name={display_name}
			set_display_name={set_display_name}
			set_room_id={set_room_id}
			user_id={user_id}
		/>
	) : (
		<GameRoom />
	);
}

export default Avalon;
