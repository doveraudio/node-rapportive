var request = require('request'),
	randomstring = require("randomstring"),
	colors = require('colors'),
	templates = require('./email-list.js').templates

module.exports = function(firstName, lastName, domain) {
	var randomEmail = randomstring.generate(7) + '@gmail.com';
	
	request('https://rapportive.com/login_status?user_email=' + randomEmail, function (error, response, body) {
		if (!error && response.statusCode === 200) {
			var sessionToken = JSON.parse(body).session_token;
			
			for (key in templates){
				var targetEmail = templates[key].replace(/\{fn\}/g, firstName).replace(/\{ln\}/g, lastName) + '@' + domain;
				
				request({
					url : 'https://profiles.rapportive.com/contacts/email/' + targetEmail,
					headers : {'X-Session-Token' : sessionToken}
				}, function (error, response, body) {
					var contact = JSON.parse(body).contact;
					
					if (contact.first_name.length === 0 && contact.last_name.length === 0) {
						console.log(contact.email.red);
					} else {
						console.log(contact.email.green);
							
						return;//found someone rapportive knows about
					}
				});
			}
		}
	});
};