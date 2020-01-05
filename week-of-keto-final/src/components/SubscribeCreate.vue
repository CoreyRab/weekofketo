<template>
	<form class="flex w-full" :class="{ 'flex-col': stacked }">
		<input
			type="email"
			v-model="email"
			placeholder="you@email.com"
			:class="{ 'border-red-700': error }"
			class="focus:outline-none text-lg focus:shadow-outline border border-gray-700 rounded py-3 px-4 block appearance-none leading-normal w-full max-w-450px"
		/><button
			@click="submitEmail"
			:class="{ 'mt-4': stacked }"
			type="submit"
			:disabled="isDisabled"
			class="bg-green-700 hover:bg-green-800 text-white text-lg font-bold py-3 px-4 border border-green-700 rounded uppercase max-w-450px"
		>
			SIGN UP FREE
		</button>
	</form>
</template>

<script>
import axios from "axios";

const REGEX_EMAIL = RegExp(
	/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i
);

export default {
	name: "SubscribeCreate",
	props: { stacked: { type: Boolean, default: false } },
	data() {
		return {
			email: "",
			isDisabled: false,
			error: false
		};
	},
	computed: {
		netlify_function_url() {
			return process.env.GRIDSOME_NETLIFY === "true"
				? "/.netlify/functions"
				: "http://localhost:9000";
		},
		isNotValidEmail() {
			return !REGEX_EMAIL.test(this.email.toLowerCase())
				? "Must be a valid email"
				: "";
		}
	},
	methods: {
		submitEmail(e) {
			if (!this.isNotValidEmail) {
				e.preventDefault();
				this.isDisabled = true;
				axios
					.post(`${this.netlify_function_url}/createSubscriber`, {
						email: this.email
					})
					.then(res => {
						if (res.email_address) {
							this.email = "";
							this.error = false;
							this.$emit("success");
						} else {
							alert(res.message);
							this.error = true;
						}
					})
					.catch(err => (this.error = true))
					.finally(() => (this.isDisabled = false));
			}
		}
	}
};
</script>
