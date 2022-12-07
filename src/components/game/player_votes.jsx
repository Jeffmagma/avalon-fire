import { Collapse, Tag, Divider, Table } from "antd";
import { UserOutlined, MinusOutlined } from "@ant-design/icons";
import { useMemo } from "react";

export default function PlayerVotes(props) {
	const { game, display_names, user_id } = props;

	const table_data = useMemo(() => {
		return game.players.map((x) => ({
			key: x,
			display_name: display_names[x],
			...game.votes[x],
		}));
	}, [game]);
	const table_columns = useMemo(() => {
		return Object.keys(game.votes[user_id])
			.filter((quest_number) => game.votes[user_id][quest_number].length > 0)
			.map((quest_number) => ({
				title: "quest " + quest_number,
				dataIndex: quest_number,
				width: 110,
				render: (text, _row_data, table_index) =>
					text.map((vote, index) => {
						const team_index = Object.keys(game.votes[user_id])
							.filter((q) => q < quest_number)
							.reduce((accumulator, current) => accumulator + game.votes[user_id][current].length, 0);
						return (
							<Tag key={index} color={vote ? "green" : "red"}>
								{game.previous_teams[team_index].team.includes(game.players[table_index]) ? (
									<MinusOutlined />
								) : (
									<UserOutlined />
								)}
							</Tag>
						);
					}),
			}));
	}, [game]);

	return (
		<>
			<Divider>votes</Divider>
			<Table
				dataSource={table_data}
				columns={[{ title: "player", dataIndex: "display_name" }, ...table_columns]}
			></Table>
		</>
	);
}
