import { Checkbox } from "antd";
import { useForm } from "antd/es/form/Form";

export default function TeamSelect(props) {
	const { game } = props;
	const [form] = useForm();
	return <Checkbox.Group options={game.players.map((user) => ({ label: props.display_names[user], value: user }))} />;
}
