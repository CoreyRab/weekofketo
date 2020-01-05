<template>
	<div
		role="checkbox"
		tabindex="0"
		@click.prevent="toggle"
		@keydown.space.prevent="toggle"
		:aria-checked="value.toString()"
		class="w-6 flex items-center flex-col justify-center"
	>
		<IconCircle v-show="!value" />
		<IconCheck v-show="value" />
	</div>
</template>

<script>
import IconCircle from "../assets/icon-circle.svg";
import IconCheck from "../assets/icon-check.svg";
export default {
	name: "BaseCartCheck",
	components: { IconCircle, IconCheck },
	props: {
		value: {
			type: Boolean,
			required: true,
			note: "True or false depending on the state of the toggle"
		}
	},
	methods: {
		toggle() {
			this.$emit("input", !this.value);
		}
	}
};
</script>
