import React, { lazy, useState } from "react";
import ReactDOM from "react-dom/client";
const Avalon = lazy(() => import("./App"));

import { ConfigProvider, Row, Switch, Col, theme } from "antd";

function ThemedApp() {
	const [custom_theme, set_theme] = useState({
		colorPrimary: "#1890ff",
	});
	return (
		<ConfigProvider theme={{ token: custom_theme, components: { Steps: { colorPrimary: "green" } } }}>
			<Row>
				<Switch
					defaultChecked
					onChange={(checked) => {
						if (checked) {
							set_theme({
								colorPrimary: "#1890ff",
							});
						} else {
							set_theme({
								colorPrimary: "red",
							});
						}
					}}
				/>
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
