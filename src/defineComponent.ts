export const defineComponent = (renderFunc: Function) => ({
	setup() {
		return renderFunc;
	},
});
