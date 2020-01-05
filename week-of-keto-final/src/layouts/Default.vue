<template>
	<BaseSEO>
		<div class="layout mb-10" style=" scroll-behavior: smooth;">
			<header class="flex justify-between my-10 max-w-850px mx-auto">
				<g-link to="/">
					<g-image
						alt="WOK Logo"
						src="../assets/wok-logo.png"
						width="200"
				/></g-link>
				<nav class="flex">
					<g-link
						v-for="(link, index) in links"
						:key="index"
						:to="link.path"
						class="flex items-center text-gray-700 text-xl hover:border"
						><div class="ml-5 ">
							{{ link.name }}
						</div></g-link
					>
					<a
						class="flex items-center text-gray-700 text-xl hover:border ml-5 "
						style="order: 2"
						href="mailto:corey@weekofketo.com"
						>Contact</a
					>
				</nav>
			</header>
			<slot />
			<footer class="my-10"></footer>
		</div>
	</BaseSEO>
</template>
<script>
import BaseSEO from "../components/BaseSEO";
export default {
	name: "DefaultLayout",
	components: {
		BaseSEO
	},
	data() {
		return {
			links: [
				{ name: "Home", path: "/" },
				{ name: "Issues", path: "/issues" }
			]
		};
	}
};
</script>

<static-query>
query {
  metadata {
    siteName
  }
}
</static-query>

<style>
.layout {
	margin: 0 auto;
	padding-left: 20px;
	padding-right: 20px;
}
.primary {
	fill: #397546;
}

.secondary {
	fill: #f8f998;
}
</style>
