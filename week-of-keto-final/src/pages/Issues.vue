<template>
	<Layout class="mx-auto max-w-850px">
		<div v-for="issue in issues" :key="issue.uid">
			<g-link :to="`issues/${issue.issue_number}`">
				<div class="border p-5 hover:shadow-lg">
					<h2 class="text-xl">Issue #{{ issue.issue_number }}</h2>
					<span class="text-sm text-gray-600 py-1">{{
						issue.date_display
					}}</span>
					<p>{{ issue.issue_sub_title_fragment }}</p>
				</div>
			</g-link>
		</div>
	</Layout>
</template>

<script>
import { dateFormat } from "~/lib/datetime";
export default {
	name: "IssueList",
	metaInfo: {
		title: "All Issues"
	},
	computed: {
		issues() {
			return this.$static.prismicio.allIssues.edges
				.map(edge => edge.node)
				.map(issue => ({
					...issue,
					...{
						issue_sub_title: issue.issue_sub_title[0].text,
						issue_sub_title_fragment:
							issue.issue_sub_title[0].text.substring(0, 300) +
							(issue.issue_sub_title[0].text.length > 300
								? " ..."
								: ""),
						uid: issue._meta.uid,
						id: issue._meta.id,
						date_display: dateFormat(issue.publish_date)
					}
				}));
		}
	}
};
</script>

<static-query>	
query {
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
         
        }
      }
    }
  }
}
</static-query>
