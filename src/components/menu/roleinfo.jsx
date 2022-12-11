import { Popover, Tag } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

export default function RoleInfo({ info }) {
	return (
		<Popover
			placement="right"
			content={info.info}
			title={
				<>
					{info.side ? <Tag color={info.side === "good" ? "green" : "red"}>{info.side}</Tag> : <></>}
					{info.helps ? <Tag color={info.helps === "good" ? "green" : "red"}>helps {info.helps}</Tag> : <></>}
				</>
			}
		>
			<QuestionCircleOutlined />
		</Popover>
	);
}
