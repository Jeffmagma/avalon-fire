import { updateDoc, doc } from "firebase/firestore";
import { Space, Input, Button, message } from "antd";
import { useRef } from "react";

import db from "../../utils/firebase";

export default function DisplayNameInput(props) {
	const { display_names, user_id } = props;

	const [message_api, context_holder] = message.useMessage();
	const display_name = useRef("");

	function update_display_name() {
		updateDoc(doc(db, "users", user_id), { display_name: display_name.current.input.value })
			.then(() =>
				message_api.open({
					type: "success",
					content: "display name updated!",
				})
			)
			.catch(() =>
				message_api.open({
					type: "error",
					content: "error updating display name!",
				})
			);
	}

	return (
		<Space>
			<Input
				defaultValue={display_names[user_id]}
				placeholder="change this!"
				addonBefore="display name:"
				ref={display_name}
			/>
			{context_holder}
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
