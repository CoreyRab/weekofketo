<template>
	<div
		class="w-full border border-t-0 p-2 hover:shadow-lg block"
		:class="{ 'border-t': index === 0 }"
	>
		<div class="flex">
			<div class="flex items-center">
				<BaseCartCheck
					v-model="selected"
					:title="
						selected ? `uncheck to remove from shopping list` : null
					"
					class="ml-2 mr-4"
				/>
			</div>
			<div class="flex flex-col">
				<h2 class="text-xl border-b-4 border-avocado">
					<a
						:href="recipe.recipe_url.url"
						target="_blank"
						rel="noopener noreferrer"
						class=""
						:aria-label="
							`View Full ${recipe.recipe_name[0].text} recipe`
						"
					>
						{{ recipe.recipe_name[0].text }}
					</a>
				</h2>
				<div class=" mt-1 mb-1 text-xs text-gray-700">
					<span class="uppercase">Calories</span>:
					{{ recipe.recipe_calories }} |
					<span class="uppercase">Fat</span>: {{ recipe.recipe_fat }}g
					| <span class="uppercase">Net Carbs</span>:
					{{ recipe.recipe_net_carbs }}g |
					<span class="uppercase">Protein</span>:
					{{ recipe.recipe_protein }}g
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { mapState, mapGetters, mapActions } from "vuex";
import BaseCartCheck from "../components/BaseCartCheck";
export default {
	name: "RecipeItem",
	components: { BaseCartCheck },
	props: {
		recipe: { type: Object, required: true },
		index: { type: Number, required: true }
	},
	data() {
		return {};
	},
	computed: {
		...mapState("list", ["recipesSelectedIds"]),
		id() {
			return this.recipe._meta.id;
		},
		isSelected() {
			return this.recipesSelectedIds.includes(this.id);
		},
		selected: {
			get: function() {
				return this.isSelected;
			},
			set: function() {
				this.toggleRecipe(this.id);
			}
		}
	},
	methods: {
		...mapActions("list", ["toggleRecipe"])
	}
};
</script>
