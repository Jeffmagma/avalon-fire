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

import { Space, Row, Col, Input, Button } from "antd";
import "antd/dist/antd.dark.min.css";

import RoomList from "./components/RoomList";
import db from "./firebase";

function create_game(creator, data) {
	addDoc(collection(db, "games"), {
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

function App() {
	const [game_id, set_game_id] = useState("");
	//const [user_id, set_user_id] = useState("");
	const [display_name, set_display_name] = useState("");

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				//set_user_id(user.uid);
				console.log("user:" + user.uid);

				let user_info = doc(db, "users", user.uid);
				getDoc(user_info).then((snapshot) => {
					if (snapshot.exists()) {
						console.log("found name");
						set_display_name(snapshot.data().display_name);
					} else {
						console.log("added user");
						setDoc(user_info, { display_name: user.uid });
						set_display_name(user.uid);
					}
				});
			}
		});
		signInAnonymously(auth)
			.then(() => {
				console.log("successfully signed in");
			})
			.catch((error) => {
				console.err("error signing in:" + error.code + error.message);
			});
	}, []);

	return (
		<div className="App">
			<header className="App-header">
				<p>avalon {display_name}</p>
				<CreateGame user={display_name} />
				{game_id === "" ? <RoomList sgid={set_game_id} /> : <Game id={game_id} sgid={set_game_id} />}
			</header>
		</div>
	);
}

function update_display_name(id, name) {
	console.log(id);
	console.log(name);
	updateDoc(doc(db, "users", id), { display_name: name });
}

function Menu(props) {
	return (
		<Space direction="vertical" size={20} style={{ width: "100%" }}>
			<Row />
			<Row>
				<Col span={4} offset={10} style={{ textAlign: "center" }}>
					<Space>
						<Input addonBefore="display name:" onChange={(e) => props.set_display_name(e.target.value)} />
						<Button
							type="primary"
							onClick={() => {
								update_display_name(props.user_id, props.display_name);
							}}
						>
							update
						</Button>
					</Space>
				</Col>
			</Row>
			<Row>
				<Col span={24} style={{ textAlign: "center" }}>
					<h1>avalon test 1</h1>
				</Col>
			</Row>
			<Row>
				<Col span={6} offset={6}>
					<h1>avalon test 1</h1>
				</Col>
				<Col span={6}>
					<h1>avalon test 5</h1>
				</Col>
			</Row>
		</Space>
	);
}

function GameRoom(props) {}

function Avalon() {
	const [room_id, set_room_id] = useState("");
	const [user_id, set_user_id] = useState("");
	const [display_name, set_display_name] = useState("");

	// when the page first loads, create a user id
	useEffect(() => {
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
	console.log("room id:" + room_id);
	return room_id === undefined || room_id === "" ? (
		<Menu display_name={display_name} set_display_name={set_display_name} user_id={user_id} />
	) : (
		<GameRoom />
	);
}

export default Avalon;
