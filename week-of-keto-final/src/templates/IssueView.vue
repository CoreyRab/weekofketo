<template>
	<Layout>
		<div
			class="flex flex-col md:flex-row justify-center "
			style=" scroll-behavior: smooth;"
		>
			<!-- ISSUE  -->
			<div class="flex flex-col lg:mr-10 w-full lg:max-w-700px">
				<div
					class="flex flex-col md:flex-row justify-center items-centre  container mx-auto mt-8"
				>
					<div class="w-full">
						<div>
							<div class="flex justify-between">
								<div>
									<h2 class="text-2xl uppercase">
										Issue #{{ issue.issue_number }}
									</h2>
									<span class="text-sm text-gray-600 py-1">{{
										issue.date_display
									}}</span>
								</div>
								<div
									class="md:hidden"
									:class="{ hidden: this.$route.hash }"
								>
									<g-link
										:to="
											`issues/${issue.issue_number}#shoppinglist`
										"
										><button
											class="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 border border-green-700 rounded uppercase max-w-450px"
										>
											Shopping List
										</button></g-link
									>
								</div>
							</div>
						</div>
						<p>{{ issue.issue_sub_title }}</p>
					</div>
				</div>
				<div class="text-xl uppercase mt-8 mb-4">Meal Prep Lunch</div>
				<RecipeItem
					v-for="(recipe, index) in lunch_list"
					:recipe="recipe"
					:index="index"
					:key="recipe._meta.id"
				/>
				<div class="text-xl uppercase mt-8 mb-4">
					Dinners for the Week
				</div>
				<RecipeItem
					v-for="(recipe, index) in dinner_list"
					:recipe="recipe"
					:index="index"
					:key="recipe._meta.id"
				/>
				<div class="flex text-gray-500 italic m-4">
					<IconCheveronUp class="w-6 mr-4" /><span>{{
						anyRecipesSelected
							? "Uncheck to remove from shopping list"
							: "Select to add ingredients to shopping list."
					}}</span>
				</div>
			</div>
			<!-- SHOPPING LIST  -->
			<ShoppingList
				id="shoppinglist"
				class="md:ml-5 w-full lg:max-w-700px"
			/>
		</div>
	</Layout>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import { dateFormat } from "~/lib/datetime";
import Layout from "../layouts/Default";
import RecipeItem from "../components/RecipeItem";
import ShoppingList from "../components/ShoppingList";
import IconCheveronUp from "../assets/icon-cheveron-up.svg";

export default {
	name: "IssueView",
	metaInfo() {
		return {
			title: `Issue ${this.issue.issue_number} | Week of Keto`,
			// override the parent template and just use the above title only
			titleTemplate: null
		};
	},
	components: { Layout, RecipeItem, ShoppingList, IconCheveronUp },
	computed: {
		//find issues from graphQL response
		...mapState("list", ["activeIssue", "recipesSelectedIds"]),
		issue() {
			return this.$page.prismicio.allIssues.edges
				.map(edge => edge.node)
				.map(issue => ({
					...issue,
					...{
						issue_sub_title: issue.issue_sub_title[0].text,
						uid: issue._meta.uid,
						id: issue._meta.id,
						date_display: dateFormat(issue.publish_date)
					}
				}))[0];
		},
		//get all dinner recipes, set type
		dinner_list() {
			return this.issue.body
				.filter(item => !!item.fields[0].dinners)[0]
				.fields.map(item => ({
					...item.dinners,
					...{ type: "dinner" }
				}));
		},
		//get all other recipes, set type
		lunch_list() {
			return this.issue.body
				.filter(item => !!item.fields[0].issue_recipes)[0]
				.fields.map(item => ({
					...item.issue_recipes,
					...{ type: "lunch" }
				}));
		},
		//combine all recipes with type ready to be added to the store
		all_recipes() {
			return [...this.dinner_list, ...this.lunch_list].map(r => ({
				...r,
				...{
					issue_id: this.issue._meta.id,
					issue_number: this.issue.issue_number
				}
			}));
		},
		anyRecipesSelected() {
			return this.all_recipes.some(recipe =>
				this.recipesSelectedIds.includes(recipe._meta.id)
			);
		}
	},
	methods: { ...mapActions("list", ["addRecipes", "setActiveIssue"]) },
	watch: {
		all_recipes: {
			handler() {
				//on page load add to store
				if (
					!this.activeIssue ||
					this.activeIssue !== this.issue._meta.id
				) {
					this.addRecipes(this.all_recipes);
				}
			},
			immediate: true,
			deep: true
		}
	}
};
</script>

<page-query>
query Issue($id: String!) {
  prismicio {
    allIssues (id: $id) {
      edges {
        node {
          _meta {
            id
            uid
          }
          issue_number
          issue_sub_title
          publish_date
          body {
            ... on prismicio_IssueBodyDinner_recipes {
              fields {
                 dinners {
                  ... on prismicio_Recipe {
                    _meta {
                      uid
                      id
                    }
                    recipe_name
                    recipe_description
                    recipe_url {
                      ... on prismicio__ExternalLink {
                        url
                      }
                    }
                    recipe_calories
                    recipe_net_carbs
                    recipe_protein
                    recipe_fat
                    body {
                      __typename
                      ... on prismicio_RecipeBodyRecipe_items {
                        fields {
                          ingredient_name
                          measurement
                          store_aisle
                          item_quantity
                        }
                      }
                    }
                  }
                }
              }
            }
            ... on prismicio_IssueBodySelect_recipes {
              fields {
                issue_recipes {
                  ... on prismicio_Recipe {
                    _meta {
                      uid
                      id
                    }
                    recipe_name
                    recipe_description
                    recipe_url {
                      ... on prismicio__ExternalLink {
                        url
                      }
                    }
                    recipe_calories
                    recipe_net_carbs
                    recipe_protein
                    recipe_fat
                    body {
                      __typename
                      ... on prismicio_RecipeBodyRecipe_items {
                        fields {
                          ingredient_name
                          measurement
                          store_aisle
                          item_quantity
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}



</page-query>
