import { Popover, Tag } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

export default function RoleInfo(props) {
	const role = props.info;

	return (
		<Popover
			placement="right"
			content={role.info}
			title={
				<>
					{role.side ? <Tag color={role.side === "good" ? "green" : "red"}>{role.side}</Tag> : <></>}
					{role.helps ? <Tag color={role.helps === "good" ? "green" : "red"}>helps {role.helps}</Tag> : <></>}
				</>
			}
		>
			<QuestionCircleOutlined />
		</Popover>
	);
}
