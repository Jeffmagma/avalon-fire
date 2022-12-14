import { collection, onSnapshot, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import React, { useState, useEffect, lazy, Suspense } from "react";

import db, { auth } from "./utils/firebase";
import { join_room } from "./utils/room";
import { Skeleton } from "antd";

const Lobby = lazy(() => import("./components/lobby/lobby"));
const Menu = lazy(() => import("./components/menu/menu"));
const GameRoom = lazy(() => import("./components/game/game_room"));

function Avalon() {
	const [room_id, set_room_id] = useState("");
	const [user_id, set_user_id] = useState("");
	const [user_state, set_user_state] = useState("menu");
	const [display_names, set_display_names] = useState({});

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
						const data = snapshot.data();
						// if the user already exists, get the display name from the server
						console.log("found user with uid [" + user.uid + "] display name [" + data.display_name + "]");
						// if they are already in a game, put them into that room automatically
						if (data.current_room !== "") {
							join_room(data.current_room, user.uid, set_user_state, set_room_id);
						}
					} else {
						// add a user to the database that isn't currently in a game
						console.log("added user");
						setDoc(user_info, { current_room: "", display_name: user.uid });
					}
				});
			}
		});
		// attempt an "anonymous" sign in
		signInAnonymously(auth).then(() => {
			console.log("successfully signed in");
		});
	}, []);

	useEffect(() => {
		if (user_id === "") return;
		const user_doc = doc(db, "users", user_id);
		if (user_state === "menu") {
			updateDoc(user_doc, { current_room: "" });
		} else {
			updateDoc(user_doc, { current_room: room_id });
		}
		console.log("state is now:" + user_state);
	}, [user_state]);

	// render based on where in the site the user should be
	switch (user_state) {
		case "game":
			return (
				<Suspense fallback={<Skeleton />}>
					<GameRoom
						room_id={room_id}
						user_id={user_id}
						display_names={display_names}
						set_room_id={set_room_id}
						set_user_state={set_user_state}
					/>
				</Suspense>
			);
		case "lobby":
			return (
				<Suspense fallback={<Skeleton />}>
					<Lobby
						room_id={room_id}
						user_id={user_id}
						display_names={display_names}
						set_room_id={set_room_id}
						set_user_state={set_user_state}
					/>
				</Suspense>
			);
		case "menu":
			return (
				<Suspense fallback={<Skeleton />}>
					<Menu
						user_id={user_id}
						display_names={display_names}
						set_room_id={set_room_id}
						set_user_state={set_user_state}
					/>
				</Suspense>
			);
		default:
			<>
				invalid state! <Skeleton />
			</>;
	}
}

export default Avalon;
