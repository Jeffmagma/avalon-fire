import TeamSelect from "./team_select";
import TeamVote from "./team_vote";
import QuestVote from "./quest_vote";
import Assassinate from "./assassinate";

// do this when the thing sizes get big
/*import { lazy } from "react";
const TeamSelect = lazy(() => import("./team_select"));
const TeamVote = lazy(() => import("./team_vote"));
const QuestVote = lazy(() => import("./quest_vote"));*/

export default function GameContent({ game, display_names, user_id, game_doc }) {
	switch (game.game_status) {
		case "select":
			return <TeamSelect game={game} display_names={display_names} user_id={user_id} game_doc={game_doc} />;
		case "vote":
			return <TeamVote game={game} display_names={display_names} user_id={user_id} game_doc={game_doc} />;
		case "quest":
			return <QuestVote game={game} display_names={display_names} user_id={user_id} game_doc={game_doc} />;
		case "assassinate":
			return <Assassinate game={game} display_names={display_names} user_id={user_id} game_doc={game_doc} />;
		case "evil_win":
			return <>evil wins!</>;
		case "good_win":
			return <>good wins!</>;
		default:
			return <>invalid game state!</>;
	}
}
