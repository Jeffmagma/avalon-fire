import { lazy } from "react";

const TeamSelect = lazy(() => import("./team_select"));
const TeamVote = lazy(() => import("./team_vote"));
const QuestVote = lazy(() => import("./quest_vote"));

export default function GameContent(props) {
	const { game } = props;

	switch (game) {
		case "select":
			return <TeamSelect />;
		case "vote":
			return <TeamVote />;
		case "quest":
			return <QuestVote />;
		default:
			return <>invalid game state!</>;
	}
}
