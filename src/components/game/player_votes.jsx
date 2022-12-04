import { Collapse, Row, Col, Tag, Divider } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
const { Panel } = Collapse;

export default function PlayerVotes(props) {
	const { game, display_names } = props;

	return (
		<>
			<Divider>votes</Divider>
			<Collapse style={{ width: "100%" }}>
				{[...Array(game.quest).keys()].map((x) => {
					const quest = x + 1;
					return (
						<Panel
							header={
								<>
									quest + {quest}
									{quest === game.quest ? (
										<Tag>current</Tag>
									) : (
										<Tag>{game.quest_results[x] ? "pass" : "fail"}</Tag>
									)}
								</>
							}
							key={x}
						>
							{Object.keys(game.votes).map((key) => (
								<Row key={key + x}>
									<Col span={14}>{display_names[key]}</Col>
									{game.votes[key][quest].map((vote) => (
										<Col span={2} key={key + x + Math.random()}>
											{vote ? (
												<Tag color="green">
													<CheckOutlined />
												</Tag>
											) : (
												<Tag color="red">
													<CloseOutlined />
												</Tag>
											)}
										</Col>
									))}
								</Row>
							))}
						</Panel>
					);
				})}
			</Collapse>
		</>
	);
}
