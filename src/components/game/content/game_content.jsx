import { lazy } from "react";

const TeamSelect = lazy(() => import("./team_select"));
const TeamVote = lazy(() => import("./team_vote"));
const QuestVote = lazy(() => import("./quest_vote"));

export default function GameContent(props) {
	const { game, display_names, room_id, user_id } = props;

	switch (game.game_status) {
		case "select":
			return <TeamSelect game={game} display_names={display_names} room_id={room_id} user_id={user_id} />;
		case "vote":
			return <TeamVote game={game} display_names={display_names} room_id={room_id} user_id={user_id} />;
		case "quest":
			return <QuestVote game={game} display_names={display_names} room_id={room_id} user_id={user_id} />;
		default:
			return <>invalid game state!</>;
	}
}
