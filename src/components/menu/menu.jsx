import { Space, Row, Col } from "antd";

import CreateRoomForm from "./create_room_form";
import DisplayNameInput from "./displayname_input";
import RoomList from "./room_list";

export default function Menu(props) {
	return (
		<Space direction="vertical" size="large" style={{ width: "100%" }}>
			<Row>
				<Col span={24} style={{ textAlign: "center" }}>
					<DisplayNameInput
						display_names={props.display_names}
						set_display_name={props.set_display_name}
						user_id={props.user_id}
					/>
				</Col>
			</Row>

			<Row>
				<Col
					xs={{ span: 7, offset: 3 }}
					sm={{ span: 6, offset: 4 }}
					md={{ span: 5, offset: 5 }}
					lg={{ span: 4, offset: 6 }}
				>
					<CreateRoomForm
						user_id={props.user_id}
						set_user_state={props.set_user_state}
						set_room_id={props.set_room_id}
					/>
				</Col>
				<Col xs={{ span: 11 }} sm={{ span: 10 }} md={{ span: 9 }} lg={{ span: 8 }}>
					<RoomList
						user_id={props.user_id}
						set_room_id={props.set_room_id}
						set_user_state={props.set_user_state}
					/>
				</Col>
			</Row>
		</Space>
	);
}
