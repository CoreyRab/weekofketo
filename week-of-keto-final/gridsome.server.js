// Server API makes it possible to hook into various parts of Gridsome
// on server-side and add custom data to the GraphQL data layer.
// Learn more: https://gridsome.org/docs/server-api/

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

module.exports = function(api) {
	api.loadSource(({ addCollection }) => {
		// Use the Data Store API here: https://gridsome.org/docs/data-store-api/
	});

	api.createPages(({ createPage }) => {
		// Use the Pages API here: https://gridsome.org/docs/pages-api/
	});

	api.createPages(async ({ graphql, createPage }) => {
		const { data } = await graphql(`
			{
				prismicio {
					allIssues {
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
		`);

		data.prismicio.allIssues.edges.forEach(({ node }) => {
			createPage({
				path: `/issues/${node.issue_number}`,
				component: "./src/templates/IssueView.vue",
				context: {
					id: node._meta.id
				}
			});
		});
	});
};
