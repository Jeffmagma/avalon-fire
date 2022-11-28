import React, { lazy, useState } from "react";
import ReactDOM from "react-dom/client";
const Avalon = lazy(() => import("./App"));

import { ConfigProvider, Row, Switch } from "antd";

function ThemedApp() {
	const [theme, set_theme] = useState({
		colorPrimary: "#1890ff",
	});
	return (
		<ConfigProvider theme={{ token: theme }}>
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
