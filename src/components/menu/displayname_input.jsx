import { updateDoc, doc } from "firebase/firestore";
import { Space, Input, Button } from "antd";
import { useRef } from "react";

import db from "../../utils/firebase";

export default function DisplayNameInput(props) {
	const { user_id } = props;
	const display_name = useRef("");

	function update_display_name() {
		updateDoc(doc(db, "users", user_id), { display_name: display_name.current.input.value });
	}

	return (
		<Space>
			<Input defaultValue="change this!" addonBefore="display name:" ref={display_name} />
			<Button
				type="primary"
				onClick={() => {
					update_display_name();
				}}
			>
				update
			</Button>
		</Space>
	);
}
