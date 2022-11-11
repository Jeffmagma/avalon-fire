import "./App.css";

import { initializeApp } from "firebase/app";
import {
	getFirestore,
	collection,
	onSnapshot,
	doc,
	addDoc,
	serverTimestamp,
	query,
	orderBy,
	updateDoc,
	arrayUnion,
	arrayRemove,
} from "firebase/firestore";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import React, { useState, useEffect } from "react";

const firebaseConfig = {
	apiKey: "AIzaSyC5GPT8W32RQXcpy_dLXM7K1cpCvPISEY4",
	authDomain: "cyan-pink.firebaseapp.com",
	projectId: "cyan-pink",
	storageBucket: "cyan-pink.appspot.com",
	messagingSenderId: "612760891208",
	appId: "1:612760891208:web:fa977503cb26c8df074d7d",
	measurementId: "G-6FXRTHXG1C",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const q = query(collection(db, "games"), orderBy("created", "desc"));

function create_game(data) {
	addDoc(q, {
		created: serverTimestamp(),
		players: [],
		roles: data.roles,
		status: "lobby",
		turn: 0,
		votes: { 0: [true, false], 1: [false, true] },
	});
}

function join_game(id, player_name) {
	const game_doc = doc(db, "games", id);
	updateDoc(game_doc, { players: arrayUnion(player_name) });
}

function CreateGame() {
	return (
		<button
			onClick={() => {
				create_game({ roles: [] });
			}}
		>
			create game
		</button>
	);
}

// join a game with id, adding

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

function GameList(props) {
	const [games, setGames] = useState([]);
	useEffect(() => {
		onSnapshot(q, (snapshot) => {
			setGames(
				snapshot.docs.map((doc) => ({
					id: doc.id,
					item: doc.data(),
				}))
			);
		});
	}, []);

	return (
		<div>
			test:
			{games.map((game) => {
				return (
					<div key={game.id}>
						id: {game.id} players: {game.item.player_count}
						<button
							onClick={() => {
								join_game(game.id);
								console.log(game.id);
								props.sgid(game.id);
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
const auth = getAuth();

function App() {
	const [game_id, set_game_id] = useState("");

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				const uid = user.uid;
				console.log(uid);
			}
		});
		signInAnonymously(auth)
			.then(() => {
				console.log("successfully signed in");
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				console.log(errorMessage + errorCode);
			});
	}, []);

	return (
		<div className="App">
			<header className="App-header">
				<p>avalon</p>
				<CreateGame />
				{game_id === "" ? <GameList sgid={set_game_id} /> : <Game id={game_id} sgid={set_game_id} />}
			</header>
		</div>
	);
}

export default App;
