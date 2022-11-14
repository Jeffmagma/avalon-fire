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
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import React, { useState, useEffect } from "react";

import "antd/dist/antd.dark.min.css";

import Lobby from "./components/lobby/lobby";
import Menu from "./components/menu/menu";
import db, { auth } from "./firebase";

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

function GameRoom(props) {}

function Avalon() {
	const [room_id, set_room_id] = useState("");
	const [user_id, set_user_id] = useState("");
	const [user_state, set_user_state] = useState("menu");
	const [display_names, set_display_names] = useState({});
	const [display_name, set_display_name] = useState("");

	// when the page first loads, create a user id
	useEffect(() => {
		// keep track of username changes
		const user_collection = collection(db, "users");
		onSnapshot(user_collection, (collection) => {
			collection.forEach((doc) => {
				set_display_names((names) => ({ ...names, [doc.id]: doc.data().display_name }));
			});
		});
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

	switch (user_state) {
		case "game":
			return <GameRoom />;
		case "lobby":
			return (
				<Lobby
					room_id={room_id}
					user_id={user_id}
					display_names={display_names}
					set_user_state={set_user_state}
				/>
			);
		default:
		case "menu":
			return (
				<Menu
					display_name={display_name}
					set_display_name={set_display_name}
					set_room_id={set_room_id}
					user_id={user_id}
					set_user_state={set_user_state}
				/>
			);
	}
}

export default Avalon;
