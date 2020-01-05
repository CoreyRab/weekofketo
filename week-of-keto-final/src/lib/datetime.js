"use strict";
import { format, parseISO, isDate } from "date-fns";

//Currently Using v2.8.1 - check doc version for correct template strings https://date-fns.org/v2.8.1/docs/format
function dateFormat(datetime, template) {
	try {
		if (typeof datetime === "string") {
			if (!isDate(datetime)) {
				datetime = new Date(datetime).toISOString().split("T")[0];
			}
			datetime = parseISO(datetime);
		}
		return template === undefined
			? format(datetime, "MMMM do, yyyy")
			: format(datetime, template);
	} catch (e) {
		return "";
	}
}

export { dateFormat };
