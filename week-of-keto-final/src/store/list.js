import Vue from "vue";
import { resetState } from "./common";
import { enGB } from "date-fns/locale";
import Fraction from "fraction.js";

const initial_state = {
	activeIssue: null,
	recipes: {},
	recipesSelectedIds: [],
	ingredientsSelected: []
};

const state = { ...initial_state };

const getters = {
	recipeIdNameMap() {
		return Object.keys(state.recipes).length
			? // return object - {ingredient_n: [ ingredient, ... ]}
			  Object.entries(state.recipes).reduce(
					(obj, [recipe_id, recipe]) => {
						obj[recipe_id] = recipe.recipe_name[0].text;
						return obj;
					},
					{}
			  )
			: {};
	},
	ingredientsByRecipeId(state) {
		return Object.keys(state.recipes).length
			? // return object - {recipe_key: [ ingredient, ... ]}
			  Object.entries(state.recipes).reduce(
					(obj, [recipe_id, recipe]) => {
						obj[recipe_id] = recipe.body[0].fields;
						return obj;
					},
					{}
			  )
			: {};
	},

	selectedIngredients(state, getters) {
		return state.recipesSelectedIds.length
			? // return array of selected ingredients
			  Object.entries(getters.ingredientsByRecipeId).reduce(
					(arr, [recipe_id, ingredients]) =>
						state.recipesSelectedIds.includes(recipe_id)
							? [
									...arr,
									...ingredients.map(i => ({
										...i,
										...{
											recipe_id,
											name: i.ingredient_name[0].text,
											source: [
												`${i.item_quantity} ${i.measurement} from ${getters.recipeIdNameMap[recipe_id]}`
											]
										}
									}))
							  ]
							: arr,
					[]
			  )
			: [];
	},
	selectedIngredientsConsolidated(state, getters) {
		return getters.selectedIngredients.length
			? getters.selectedIngredients.reduce((acc, ingredient) => {
					//check if ingredient exists
					const existingIngredientSearchCondition = i =>
						i.name.toLowerCase() ===
							ingredient.name.toLowerCase() &&
						i.measurement.toLowerCase() ===
							ingredient.measurement.toLowerCase();
					const existingIngredient = acc.find(i =>
						existingIngredientSearchCondition(i)
					);
					const existingIngredientIndex = acc.findIndex(i =>
						existingIngredientSearchCondition(i)
					);
					if (existingIngredient) {
						// if exists add current ingredient
						const updatedIngredient = combineIngredients(
							existingIngredient,
							ingredient
						);

						Vue.set(
							acc,
							existingIngredientIndex,
							updatedIngredient
						);
					} else {
						//if not add initial ingredient
						const updatedIngredient = convertQuantityToFraction(
							ingredient
						);
						acc.push(updatedIngredient);
					}
					// return with flattened ingredient_name
					return acc;
			  }, [])
			: [];
	},
	selectedIngredientsConsolidatedByType(state, getters) {
		const list = {};
		getters.selectedIngredientsConsolidated.forEach(i => {
			if (list[i.store_aisle]) {
				list[i.store_aisle] = [...list[i.store_aisle], ...[i]];
			} else {
				list[i.store_aisle] = [i];
			}
		});
		return list;
	}
};

const isBrowser = typeof window !== "undefined";

const actions = {
	setActiveIssue({ commit }, issue_id) {
		commit("setActiveIssue", issue_id);
	},
	addRecipes({ state, commit, dispatch }, recipes) {
		commit("addRecipes", recipes);
		dispatch("calcSelectedRecipes", {
			issue_id: recipes[0].issue_id,
			recipe_ids: recipes.map(r => r._meta.id)
		});
	},
	calcSelectedRecipes({ dispatch }, { issue_id, recipe_ids }) {
		let selected_ids = recipe_ids;
		if (isBrowser) {
			//recipes
			dispatch("setActiveIssue", issue_id);
			const previously_selected = localStorage.getItem(
				`${issue_id}-selected-recipes`
			);
			if (previously_selected) {
				selected_ids = JSON.parse(previously_selected);
			}
			dispatch("setSelectedIdsToLocalStorage", {
				issue_id,
				selected_ids
			});
			//ingredients
			const previously_selected_ingredients = localStorage.getItem(
				`${issue_id}-selected-ingredients`
			);
			if (previously_selected_ingredients) {
				dispatch(
					"selectIngredients",
					JSON.parse(previously_selected_ingredients)
				);
			}
		}
		dispatch("selectRecipes", selected_ids);
	},
	setSelectedIdsToLocalStorage({}, { issue_id, selected_ids }) {
		localStorage.setItem(
			`${issue_id}-selected-recipes`,
			JSON.stringify(selected_ids)
		);
	},
	setIngredientsIdsToLocalStorage({ state }, { issue_id, selected_ids }) {
		localStorage.setItem(
			`${issue_id}-selected-ingredients`,
			JSON.stringify(selected_ids)
		);
	},
	selectRecipes({ commit }, recipe_ids) {
		recipe_ids.forEach(id => commit("selectRecipe", id));
	},
	selectIngredients({ commit }, ingredient_ids) {
		ingredient_ids.forEach(id => commit("selectIngredient", id));
	},
	toggleRecipe({ state, commit }, recipe_id) {
		const index = state.recipesSelectedIds.indexOf(recipe_id);
		if (index === -1) {
			commit("selectRecipe", recipe_id);
		} else {
			commit("removeRecipeByIndex", index);
		}
	},
	toggleIngredient({ state, commit }, ingredient_id) {
		const index = state.ingredientsSelected.indexOf(ingredient_id);
		if (index === -1) {
			commit("selectIngredient", ingredient_id);
		} else {
			commit("removeIngredientByIndex", index);
		}
	},
	clearIngredientList({ commit }) {
		commit("clearIngredientList");
	}
};

const mutations = {
	resetState,
	setActiveIssue(state, issue_id) {
		state.activeIssue = issue_id;
	},
	addRecipes(state, recipes) {
		const new_recipes = {};

		for (let i = 0; i < recipes.length; i++) {
			new_recipes[recipes[i]._meta.id] = recipes[i];
		}
		state.recipes = { ...state.recipes, ...new_recipes };
	},
	selectRecipe(state, recipe_id) {
		state.recipesSelectedIds = [
			...state.recipesSelectedIds,
			...[recipe_id]
		];
	},
	removeRecipeByIndex(state, index) {
		const tempSelected = [...state.recipesSelectedIds];
		tempSelected.splice(index, 1);
		state.recipesSelectedIds = tempSelected;
	},
	selectIngredient(state, ingredient_id) {
		state.ingredientsSelected = [
			...state.ingredientsSelected,
			...[ingredient_id]
		];
	},
	removeIngredientByIndex(state, index) {
		const tempSelected = [...state.ingredientsSelected];
		tempSelected.splice(index, 1);
		state.ingredientsSelected = tempSelected;
	},
	clearIngredientList(state) {
		state.ingredientsSelected = [];
	}
};

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations
};

function convertQuantityToFraction(i) {
	let fraction = new Fraction(i.item_quantity);
	const newQuantity = fraction.simplify(0.01).toFraction(true);
	return {
		...i,
		...{
			item_quantity: newQuantity
		}
	};
}

function combineIngredients(a, b) {
	let sum = new Fraction(a.item_quantity).add(b.item_quantity);
	let fraction = new Fraction(sum);
	const newQuantity = fraction.toFraction(true);

	return {
		...a,
		...{
			item_quantity: newQuantity,
			source: [...a.source, ...b.source]
		}
	};
}
