import { Row, Col, List, Divider, Card } from "antd";

export default function PlayerList({ game, display_names, user_id }) {
	return (
		<Card title="players">
			<List
				bordered
				dataSource={game.players}
				renderItem={(x) => (
					<List.Item>
						<Row style={{ width: "100%" }}>
							<Col span={12} style={{ textAlign: "left" }}>
								{display_names[x]}
							</Col>
							<Col span={12} style={{ textAlign: "right" }}>
								{game.user_data[user_id][x]}
							</Col>
						</Row>
					</List.Item>
				)}
			/>
		</Card>
	);
}
