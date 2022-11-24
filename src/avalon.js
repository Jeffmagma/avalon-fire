export const roles2 = {
	good: {
		side: "good",
		optional: false,
		view_role: (_) => "good",
	},
	evil: {
		side: "evil",
		optional: false,
		view_role: (role) => {
			if (roles2[role].side === "good" || role === "oberon") {
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
			if (roles2[role].side === "good" || role === "mordred") {
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
			if (roles2[role].side === "good" || role === "oberon") {
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
		view_role: (role) => roles2["evil"].view_role(role),
		info: ["morgana appears to percival as merlin alongside the real merlin"],
	},
	mordred: {
		side: "evil",
		helps: "evil",
		optional: true,
		view_role: (role) => roles2["evil"].view_role(role),
		info: ["mordred does not appear to merlin as evil"],
	},
	oberon: {
		side: "evil",
		helps: "good",
		optional: true,
		view_role: (role) => roles2["good"].view_role(role),
		info: ["oberon does not know who else is evil, and the other evil players do not know that he is evil"],
	},
};

export const roles = {
	good: {
		good: true,
		default: true,
	},
	evil: {
		good: true,
		default: true,
	},
	merlin: {
		good: true,
		default: true,
	},
	assassin: {
		good: false,
		default: true,
	},
	percival: {
		good: true,
		default: false,
		info: ["percival knows who merlin is", "percival increases the likelihood of good to win"],
	},
	morgana: {
		good: false,
		default: false,
		info: [
			"morgana appears to percival as merlin alongside the real merlin",
			"morgana increases the likelihood of evil to win",
		],
	},
	mordred: {
		good: false,
		default: false,
		info: ["mordred does not appear to merlin as evil", "mordred increases the likelihood of evil to win"],
	},
	oberon: {
		good: false,
		default: false,
		info: [
			"oberon does not know who else is evil, and the other evil players do not know that he is evil",
			"oberon increases the likelihood of good to win",
		],
	},
};
