export const roles = {
	good: {
		side: "good",
		optional: false,
		view_role: (_) => "good",
	},
	evil: {
		side: "evil",
		optional: false,
		view_role: (role) => {
			if (roles[role].side === "good" || role === "oberon") {
				return "good";
			} else {
				return "evil";
			}
		},
	},
	merlin: {
		side: "good",
		optional: false,
		view_role: (role) => {
			if (roles[role].side === "good" || role === "mordred") {
				return "good";
			} else {
				return "evil";
			}
		},
	},
	assassin: {
		side: "evil",
		optional: false,
		view_role: (role) => {
			if (roles[role].side === "good" || role === "oberon") {
				return "good";
			} else {
				return "evil";
			}
		},
	},
	percival: {
		side: "good",
		helps: "good",
		optional: true,
		view_role: (role) => {
			if (["merlin", "morgana"].includes(role)) {
				return "merlin";
			} else {
				return "good";
			}
		},
		info: ["percival knows who merlin is, but also sees morgana as merlin"],
	},
	morgana: {
		side: "evil",
		helps: "evil",
		optional: true,
		view_role: (role) => roles["evil"].view_role(role),
		info: ["morgana appears to percival as merlins alongside the real merlin"],
	},
	mordred: {
		side: "evil",
		helps: "evil",
		optional: true,
		view_role: (role) => roles["evil"].view_role(role),
		info: ["mordred does not appear to merlin as evil"],
	},
	oberon: {
		side: "evil",
		helps: "good",
		optional: true,
		view_role: (role) => roles["good"].view_role(role),
		info: ["oberon does not know who else is evil, and the other evil players do not know that he is evil"],
	},
};

export const players_per_mission = {
	2: [1, 1, 1, 2, 1], // testing only!
	5: [2, 3, 2, 3, 3],
	6: [2, 3, 4, 3, 4],
	7: [2, 3, 3, 4, 4],
	8: [3, 4, 4, 5, 5],
	9: [3, 4, 4, 5, 5],
	10: [3, 4, 4, 5, 5],

	two_fail: (x) => x === 2 || x >= 7,
};
