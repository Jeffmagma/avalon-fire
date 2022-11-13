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
