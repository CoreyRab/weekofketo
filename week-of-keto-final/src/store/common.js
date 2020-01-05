//resetState() is used as Object.assing() doesn't clear the key/values, and assigning a blank object bricks up reactiving
function resetState(state, initial_state = null) {
	let new_state = {};
	Object.entries(initial_state).forEach(([key, value]) => {
		new_state[key] = value;
	});
	Object.assign(state, new_state);
}

export { resetState };
