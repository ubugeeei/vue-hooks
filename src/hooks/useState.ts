import { ComponentInternalInstance, getCurrentInstance } from "vue";

const COMPONENT_STATES = Symbol();
const COMPONENT_STATES_IDX = Symbol();

export const useState = <T>(
	initialState: T
): [T, (newState: T) => void] => {
	const i = getCurrentInstance() as ComponentInternalInstance & {
		[COMPONENT_STATES]?: any[];
		[COMPONENT_STATES_IDX]?: number;
	};

	// init
	if (i[COMPONENT_STATES] === undefined) i[COMPONENT_STATES] = [];
	if (i[COMPONENT_STATES_IDX] === undefined)
		i[COMPONENT_STATES_IDX] = 0;

	const currentIdx = i[COMPONENT_STATES_IDX];
	const state = i[COMPONENT_STATES][currentIdx] ?? initialState;
	i[COMPONENT_STATES][currentIdx] = state;

	const setState = (newState: T) => {
		i[COMPONENT_STATES]![currentIdx] = newState;
		i[COMPONENT_STATES_IDX] = 0;
		i.update();
	};

	i[COMPONENT_STATES_IDX]++;

	return [state, setState];
};
