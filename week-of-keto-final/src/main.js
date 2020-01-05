// This is the main.js file. Import global CSS and scripts here.
// The Client API can be used here. Learn more: gridsome.org/docs/client-api
require("~/output.css");
import store from "~/store";
import DefaultLayout from "~/layouts/Default.vue";

store.watch(
	state => {
		//watch for global state changes
		return {
			recipesSelectedIds: state.list.recipesSelectedIds,
			ingredientsSelected: state.list.ingredientsSelected
		};
	},
	(newWatchedValue, oldWatchedValue) => {
		const isBrowser = typeof window !== "undefined";
		const {
			recipesSelectedIds: newRecipesSelectedIds,
			ingredientsSelected: newIngredientsSelected
		} = newWatchedValue;
		const {
			recipesSelectedIds: oldRecipesSelectedIds,
			ingredientsSelected: oldIngredientsSelected
		} = oldWatchedValue;

		//on selected recipe change
		if (
			JSON.stringify(newRecipesSelectedIds) !==
			JSON.stringify(oldRecipesSelectedIds)
		) {
			const activeIssue = store.state.list.activeIssue;
			if (isBrowser && activeIssue) {
				store.dispatch("list/setSelectedIdsToLocalStorage", {
					issue_id: activeIssue,
					selected_ids: newRecipesSelectedIds
				});
			}
		}
		//on selected recipe change
		if (
			JSON.stringify(newIngredientsSelected) !==
			JSON.stringify(oldIngredientsSelected)
		) {
			const activeIssue = store.state.list.activeIssue;
			if (isBrowser && activeIssue) {
				store.dispatch("list/setIngredientsIdsToLocalStorage", {
					issue_id: activeIssue,
					selected_ids: newIngredientsSelected
				});
			}
		}
	}
);

export default function(Vue, { router, head, isClient, appOptions }) {
	// Set default layout as a global component
	Vue.component("Layout", DefaultLayout);
	appOptions.store = store;
}
