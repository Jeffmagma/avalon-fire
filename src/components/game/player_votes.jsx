import { Collapse, Row, Col, Tag } from "antd";
const { Panel } = Collapse;

export default function PlayerVotes(props) {
	const { game, display_names } = props;

	return (
		<Collapse>
			{[...Array(game.quest).keys()].forEach((x) => {
				const quest = x + 1;
				return (
					<Panel header={"quest " + quest}>
						<Row>
							{Object.keys(game.votes).forEach((key) => {
								<Col>{display_names[key]}</Col>;
								game.votes[key][quest].forEach((vote) => <Col>{vote}</Col>);
							})}
						</Row>
					</Panel>
				);
			})}
		</Collapse>
	);
}
