import React, { lazy, useState } from "react";
import ReactDOM from "react-dom/client";
const Avalon = lazy(() => import("./App"));

import { ConfigProvider, Row, Switch, Col } from "antd";

function ThemedApp() {
	const light_theme = {
		colorPrimary: "#1890ff",
	};
	const dark_theme = {
		colorPrimary: "red",
	};

	const [custom_theme, set_theme] = useState(light_theme);

	return (
		<ConfigProvider theme={{ token: custom_theme }}>
			<Row>
				<Switch defaultChecked onChange={(checked) => set_theme(checked ? light_theme : dark_theme)} />
				&lt;- this is gonna be a dark mode switch eventually, for now it just turns the blue accent red
			</Row>
			<Row>
				<Col span={24} style={{ textAlign: "center" }}>
					<h1>avalon test</h1>
				</Col>
			</Row>
			<Avalon />
		</ConfigProvider>
	);
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<ThemedApp />
	</React.StrictMode>
);
