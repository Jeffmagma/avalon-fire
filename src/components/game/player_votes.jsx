import { Collapse, Row, Col, Tag, Divider } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
const { Panel } = Collapse;

export default function PlayerVotes(props) {
	const { game, display_names } = props;

	return (
		<>
			<Divider>votes</Divider>
			<Collapse>
				{[...Array(game.quest).keys()].map((x) => {
					const quest = x + 1;
					return (
						<Panel header={"quest " + quest}>
							{Object.keys(game.votes).map((key) => {
								return (
									<Row>
										<Col span={12}>{display_names[key]}</Col>
										{game.votes[key][quest].map((vote) => (
											<Col span={3}>
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
								);
							})}
						</Panel>
					);
				})}
			</Collapse>
		</>
	);
}
