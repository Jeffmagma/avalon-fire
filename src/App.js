import "./App.css";

import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot, doc } from "firebase/firestore";
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
			<button onClick={() => props.sgid("")}>return to lobby</button>
		</>
	);
}

function GameList(props) {
	const [games, setGames] = useState([]);
	useEffect(() => {
		onSnapshot(collection(db, "games"), (snapshot) => {
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

function App() {
	const [game_id, set_game_id] = useState("");
	return (
		<div className="App">
			<header className="App-header">
				<p>avalon</p>
				{game_id === "" ? <GameList sgid={set_game_id} /> : <Game id={game_id} sgid={set_game_id} />}
			</header>
		</div>
	);
}

export default App;
