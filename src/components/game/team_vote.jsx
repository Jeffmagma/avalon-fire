import { Button, List } from "antd";

export default function TeamVote(props) {
	const { game, display_names } = props;
	return game.game_status === "vote" ? (
		<>
			<List dataSource={game.current_team} renderItem={(x) => <List.Item>{display_names[x]}</List.Item>} />
			<Button onClick={() => console.log("approve")}>approve</Button>
			<Button onClick={() => console.log("deny")}>deny</Button>
		</>
	) : (
		<>no team to vote on!</>
	);
}
