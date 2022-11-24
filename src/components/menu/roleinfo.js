import { Popover, Tag } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

export default function RoleInfo(props) {
	let role = props.info;
	return (
		<Popover
			placement="right"
			content={role.info}
			title={
				<>
					<Tag color={role.side === "good" ? "green" : "red"}>{role.side}</Tag>
					<Tag color={role.helps === "good" ? "green" : "red"}>helps {role.helps}</Tag>
				</>
			}
		>
			<QuestionCircleOutlined />
		</Popover>
	);
}
