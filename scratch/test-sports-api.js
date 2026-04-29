const https = require('https');

const options = {
	method: 'GET',
	hostname: 'sports-information.p.rapidapi.com',
	port: null,
	path: '/mbb/news?limit=30',
	headers: {
		'x-rapidapi-key': '127338abe6msheb9b1e786c2e478p12471fjsn87dfa9ad7445',
		'x-rapidapi-host': 'sports-information.p.rapidapi.com',
		'Content-Type': 'application/json'
	}
};

const req = https.request(options, function (res) {
	const chunks = [];

	res.on('data', function (chunk) {
		chunks.push(chunk);
	});

	res.on('end', function () {
		const body = Buffer.concat(chunks);
		console.log(body.toString().substring(0, 2000)); // Ver apenas o início
	});
});

req.on('error', (e) => {
  console.error(e);
});

req.end();
