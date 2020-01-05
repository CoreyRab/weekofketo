<static-query>
query {
  metadata {
    siteName
    siteUrl
  }
}
</static-query>

<script>
// from discussion https://github.com/gridsome/gridsome/issues/331

export default {
	metaInfo() {
		return {
			meta: [
				{ name: "description", content: this.meta.description },

				// Some Open Graph Tags
				{ property: "og:title", content: this.meta.title },
				{
					property: "og:description",
					content: this.meta.description
				},
				{ property: "og:image", content: this.meta.image },
				{
					property: "og:url",
					content: this.meta.siteUrl
				},

				// Some Twitter Cards Tags
				{ name: "twitter:card", content: "summary_large_image" },
				{ name: "twitter:title", content: this.meta.title },
				{ name: "twitter:image", content: this.meta.image },
				{
					name: "twitter:description",
					content: this.meta.description
				}
			]
		};
	},
	computed: {
		metaType() {
			const type_map = {
				//add meta type for custom SEO
				// issue_page: this.$route.path.includes("issues/")
			};
			//replacing if/else or switch with object literal to improve readability of condition statemeent - only need to read the eval once
			return Object.entries(type_map).reduce(
				(type, [new_type, isType]) => (isType ? new_type : type),
				"default"
			);
		},
		meta_default() {
			return {
				siteName: this.$static.metadata.siteName,
				siteUrl: `${this.$static.metadata.siteUrl}${this.$route.fullPath}`,
				// TODO: Update to banner
				image: `${this.$static.metadata.siteUrl}/wok-meta.png`,
				title:
					"Free weekly keto meal plan & shopping list | Week of Keto",
				description:
					"Simple keto meal plan and shopping list sent every Saturday morning"
			};
		},
		meta_data() {
			return {
				issue_page: () => this.getIssuePageMeta()
			};
		},
		meta() {
			return this.meta_data[this.metaType]
				? { ...this.meta_default, ...this.meta_data[this.metaType]() }
				: this.meta_default;
		},
		page() {
			return this.$page;
		}
	},
	methods: {
		getIssuePageMeta() {
			const meta = {};

			return meta;
		}
	},
	render(createElement) {
		return this.$scopedSlots.default({
			meta: this.meta
		});
	}
};
</script>
