import { collection, onSnapshot, doc, getDoc, setDoc } from "firebase/firestore";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import React, { useState, useEffect } from "react";

import "antd/dist/antd.dark.min.css";

import Lobby from "./components/lobby/lobby";
import Menu from "./components/menu/menu";
import GameRoom from "./components/game/gameroom";
import db, { auth } from "./firebase";
import { join_room } from "./join_leave";

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
							join_room(data.current_room, user.uid, set_user_state, set_room_id);
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

	useEffect(() => {
		console.log("state is now:" + user_state);
	}, [user_state]);

	// render based on where in the site the user should be
	switch (user_state) {
		case "game":
			return (
				<GameRoom
					room_id={room_id}
					user_id={user_id}
					set_user_state={set_user_state}
					set_room_id={set_room_id}
				/>
			);
		case "lobby":
			return (
				<Lobby
					room_id={room_id}
					user_id={user_id}
					display_names={display_names}
					set_user_state={set_user_state}
					set_room_id={set_room_id}
				/>
			);
		case "menu":
		default:
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
