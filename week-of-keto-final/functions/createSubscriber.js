const axios = require("axios");

exports.handler = function(event, context, callback) {
	const { EMAIL_OCTOPUS_API_KEY, EMAIL_OCTOPUS_LIST } = process.env;
	const url = `https://emailoctopus.com/api/1.5/lists/${EMAIL_OCTOPUS_LIST}/contacts`;

	const parsedBody = JSON.parse(event.body);
	//Send user response
	const send = (body, status = null) => {
		callback(null, {
			statusCode: status ? status : 200,
			body: JSON.stringify(body)
		});
	};

	//Send Request to Email Octopus

	const createSubscribers = () => {
		axios
			.post(url, {
				api_key: EMAIL_OCTOPUS_API_KEY,
				email_address: parsedBody.email
			})
			.then(res => send(res.data))
			//DO NOT SEND BACK THE ERR IT CONTAINS API KEY!!!!!
			.catch(err => {
				const status =
					err.response && err.response.status
						? err.response.status
						: null;
				send(
					{
						message: err.message
					},
					status
				);
			});
	};

	//Make Sure method is POST
	if (event.httpMethod == "POST") {
		createSubscribers();
	}
};
