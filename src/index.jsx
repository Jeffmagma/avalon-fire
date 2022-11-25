import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { Button, ConfigProvider, Switch, theme } from "antd";

function ThemedApp() {
	const [algorithm, set_algorithm] = useState({
		colorPrimary: "#1890ff",
	});
	return (
		<ConfigProvider theme={{ token: algorithm }}>
			<Switch
				defaultChecked
				onChange={(checked) => {
					if (checked) {
						set_algorithm({
							colorPrimary: "#1890ff",
						});
					} else {
						set_algorithm({
							colorPrimary: "red",
						});
					}
				}}
			/>
			<App />
		</ConfigProvider>
	);
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<ThemedApp />
	</React.StrictMode>
);
