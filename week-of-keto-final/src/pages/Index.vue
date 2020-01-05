<template>
	<BaseSEO>
		<div>
			<g-image
				src="../assets/wok-bg.jpg"
				alt="background meals"
				class="absolute top-0 inset-y-0 right-0 h-screen w-auto"
			/>
			<div
				class="w-full z-10 bg-white absolute h-screen  p-8 pt-16 lg:p-24 bg-fixed overflow-y-scroll hide-scroll max-w-700px lg:max-w-850px"
			>
				<div class="">
					<!-- Learn how to use images here: https://gridsome.org/docs/images -->
					<g-image
						alt="WOK Logo"
						src="../assets/wok-logo.svg"
						width="400"
					/>

					<h1 class="text-2xl font-semibold my-12 leading-snug">
						Simple keto meal plan and shopping list sent every
						Saturday morning
					</h1>
					<div class="text-xl">
						<p class="mb-4">
							Stop eating the same old boring stuff and save hours
							planning your keto meals.
						</p>
						<p>
							Make sticking to your low-carb diet easy and
							delicious with our free weekly keto meal plan and
							shopping list!
						</p>
					</div>

					<SubscribeCreate
						:stacked="true"
						@success="success = true"
						class="mt-12"
						v-if="!success"
					/>
					<div
						v-if="success"
						class="mt-10 text-lg text-green-600 font-bold"
					>
						<div
							class="border-2 border-green-600 p-4 py-6 max-w-450px"
						>
							🎉 You are in! Your first issue will be delivered
							next Saturday. 🎉
						</div>
					</div>

					<div class="my-10 text-lg">
						Still not sure?
						<g-link
							:to="`issues/${lastIssue.issue_number}`"
							class="text-green-600 underline"
							>Check out our latest issue</g-link
						>
					</div>
					<div class="text-lg text-gray-700">
						<p class="font-bold ">✨ What members are saying ✨</p>
						<p class="my-4 italic">
							"Week of Keto saves me at least 2 hours every week
							on meal planning and keeps me from ordering takeout.
							Plus, the recipes are delicious!"
						</p>
						<p>– Ryan P.</p>
					</div>
				</div>
			</div>
		</div>
	</BaseSEO>
</template>

<script>
import BaseSEO from "../components/BaseSEO";
import SubscribeCreate from "../components/SubscribeCreate";
export default {
	name: "Home",
	metaInfo: {
		title: "Free weekly keto meal plan & shopping list | Week of Keto"
	},
	components: { SubscribeCreate, BaseSEO },
	data() {
		return {
			success: false
		};
	},
	computed: {
		lastIssue() {
			return this.$static.prismicio.allIssues.edges
				.map(edge => edge.node)
				.map(issue => ({
					...issue,
					...{
						uid: issue._meta.uid,
						id: issue._meta.id
					}
				}))[0];
		}
	}
};
</script>

<static-query>
query {
  prismicio {
    allIssues(sortBy: publish_date_DESC) {
      edges {
        node {
          _meta {
            id
            uid
          }
          issue_number
        }
      }
    }
  }
}
</static-query>

<style lang="css">
.hide-scroll::-webkit-scrollbar {
	width: 0 !important;
}
.hide-scroll {
	overflow: -moz-scrollbars-none;
}
.hide-scroll {
	-ms-overflow-style: none;
}
</style>
