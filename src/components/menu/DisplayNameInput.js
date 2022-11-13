import { updateDoc, doc } from "firebase/firestore";
import { Space, Input, Button } from "antd";

import db from "../../firebase";

function update_display_name(id, name) {
	updateDoc(doc(db, "users", id), { display_name: name });
}

export default function DisplayNameInput(props) {
	return (
		<Space>
			<Input
				addonBefore="display name:"
				value={props.display_name}
				onChange={(e) => props.set_display_name(e.target.value)}
			/>
			<Button
				type="primary"
				onClick={() => {
					update_display_name(props.user_id, props.display_name);
				}}
			>
				update
			</Button>
		</Space>
	);
}
