<template>
	<div>
		<div v-for="(cat, catIndex) in categories" :key="`${cat}-${catIndex}`">
			<div class="flex justify-between items-center" v-if="!catIndex">
				<h2 class="text-2xl uppercase mt-8">
					Shopping List
				</h2>
				<button @click="clearList" class="mt-8">Clear</button>
			</div>
			<div
				class="text-xl uppercase mt-8 mb-4"
				:class="{ 'mt-0': !catIndex }"
			>
				{{ cat }}
			</div>
			<div
				v-for="(item, index) in items[cat]"
				:key="`${item.name}-${index}`"
				class="border border-t-0 p-2 hover:shadow-lg"
				:class="{ 'border-t': !index }"
				:title="`${item.source.join(' & ')}`"
			>
				<div class="flex">
					<div class="flex items-center">
						<BaseCartCheck
							:value="ingredientsSelected.includes(item.name)"
							@input="toggleIngredient(item.name)"
							class="ml-2 mr-12 w-6"
						/>
					</div>

					<div class="flex items-center w-32 text-lg">
						{{ item.item_quantity }} {{ item.measurement }}
					</div>
					<div class="text-lg">{{ item.name }}</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { mapGetters, mapState, mapActions } from "vuex";
import BaseCartCheck from "../components/BaseCartCheck";
export default {
	name: "ShoppingList",
	components: { BaseCartCheck },
	computed: {
		...mapState("list", ["ingredientsSelected"]),
		...mapGetters("list", [
			"selectedIngredientsConsolidated",
			"selectedIngredientsConsolidatedByType"
		]),
		categories() {
			return Object.keys(this.selectedIngredientsConsolidatedByType);
		},
		items() {
			return Object.entries(
				this.selectedIngredientsConsolidatedByType
			).reduce((obj, [category, list]) => {
				obj[category] = list.sort((a, b) => {
					if (a.name < b.name) {
						return -1;
					}
					if (a.name > b.name) {
						return 1;
					}
					return 0;
				});
				return obj;
			}, {});
		}
	},
	methods: {
		...mapActions("list", ["toggleIngredient", "clearIngredientList"]),
		clearList() {
			this.clearIngredientList();
		}
	}
};
</script>
