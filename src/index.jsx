import React, { lazy, useState } from "react";
import ReactDOM from "react-dom/client";
const Avalon = lazy(() => import("./App"));

import { ConfigProvider, Row, Switch, Col, theme, Layout } from "antd";
const { Header, Content } = Layout;

function ThemedApp() {
	const light_theme = {
		colorPrimary: "#1890ff",
	};
	const dark_theme = {
		colorPrimary: "red",
		colorBgContainer: "#141414",
		colorBgElevated: "#141414",
		colorBgLayout: "#141414",
	};

	const [custom_theme, set_theme] = useState(light_theme);

	return (
		<Layout style={{ width: "100%", minHeight: "100vh" }}>
			<Header>
				<Row>
					<Switch defaultChecked onChange={(checked) => set_theme(checked ? light_theme : dark_theme)} />
				</Row>
				<Row>
					<Col span={24} style={{ textAlign: "center" }}>
						<h1>avalon test</h1>
					</Col>
				</Row>
			</Header>
			<Content>
				<Avalon />
			</Content>
		</Layout>
	);
}

// render the app on the page
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
		<React.StrictMode>
			<ThemedApp />
		</React.StrictMode>
	</ConfigProvider>
);
