import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { roles } from "./avalon";
import db from "./firebase";

// shuffle an array using stackoverflow algorithm^[tm]
function shuffle(array) {
	let current_index = array.length;
	while (current_index !== 0) {
		const random_index = Math.floor(Math.random() * current_index);
		current_index--;

		[array[current_index], array[random_index]] = [array[random_index], array[current_index]];
	}
}

// set up the game based on the amount of players and starting data
export function generate_setup_data(game) {
	// count number of good and bad special roles
	let good = 0,
		evil = 0;
	game.roles.forEach((role) => {
		if (roles[role].side === "good") {
			good++;
		} else {
			evil++;
		}
	});
	const num_players = game.players.length;
	// for testing only!
	if (num_players <= 2) {
		game.roles = ["good", "evil"];
	} else {
		const total_evil = Math.ceil(num_players / 3);
		// fill remaining slots with merlin and generic roles
		game.roles = [
			...game.roles,
			"merlin",
			...Array(total_evil - evil).fill("evil"),
			...Array(num_players - total_evil - good - 1).fill("good"),
		];
		// shuffle the two data arrays to randomize roles and player order
		shuffle(game.roles);
		shuffle(game.players);
	}
	// take the shuffled arrays and create an object out of them
	const user_roles = Object.fromEntries(game.players.map((_, i) => [game.players[i], game.roles[i]]));
	console.log(user_roles);
	// create an object that represents what each info each player can see about the other players
	const user_data = Object.fromEntries(
		Object.entries(user_roles).map(([user, role]) => [
			user,
			Object.fromEntries(
				Object.entries(user_roles).map(([role_user, user_role]) => [
					role_user,
					roles[role].view_role(user_role),
				])
			),
		])
	);
	console.log(user_data);

	// create an object to keep track of each players votes
	const player_votes = Object.fromEntries(
		game.players.map((_, i) => [game.players[i], Object.fromEntries([...Array(5).keys()].map((i) => [1 + i, []]))])
	);
	console.log(player_votes);
	// return the new data that should be pushed to the game room
	return {
		current_turn: 0, // how many quest team leaders there have been (0-game end)
		current_leader: 0, // index of player choosing the mission (1-# of players)
		quest: 1, // which quest (1-5)
		team_suggestion: 1, // how many times a team has been suggested, 5 = evil win
		players: game.players, // list of players, in order
		user_data: user_data, // what roles each players could see
		user_roles: user_roles, // maps of player id to their role
		status: "game", // status of the game, set to menu once the game is over and everyone else disconnects
		game_status: "select", // lobby -> select -> vote -> select or quest -> select ... -> assassinate -> good_win/evil_win
		quest_votes: [], // pass/fail on current quest
		team_votes: [], // approve/deny on current team
		votes: player_votes, // object storying each players votes and on which mission (votes[user_id][mission] = [..., votes for the player])
		timeline: [], // select -> leader, team, result | mission -> team, result | assassination -> target, result
		quest_results: [], // results of the quests so far
	};
}

// set the current room of the player, and set the room to contain the player
export function join_room(room_id, user_id, set_user_state, set_room_id) {
	const game_doc = doc(db, "rooms", room_id);

	updateDoc(game_doc, { players: arrayUnion(user_id) });
	getDoc(game_doc).then((snapshot) => {
		set_user_state(snapshot.data().status);
	});

	set_room_id(room_id);
	console.log("joined game: " + room_id);
}

// clear the current room of the player and remove the player from the list in the room
export function leave_room(room_id, user_id, set_user_state, set_room_id) {
	const game_doc = doc(db, "rooms", room_id);

	set_user_state("menu");
	set_room_id("");

	updateDoc(game_doc, { players: arrayRemove(user_id) });

	console.log("left game: " + room_id);
}
// TODO doing it this way is slow, maybe revert
