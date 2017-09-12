const express = require('express'),
	Twit = require('twit'),
	pug = require('pug'),
	api = require('./config');

const app = express();
app.set('view engine', 'pug');
app.use('/static', express.static('public'));

var twit = new Twit({
  consumer_key:         api.consumer_key,
  consumer_secret:      api.consumer_secret,
  access_token:         api.access_token,
  access_token_secret:  api.access_token_secret
})

app.get('/', (req, res) => {

	res.render('layout');

	// twit.get('friends/list', {count: 5, include_user_entities: false}, (err, data, response) => {
	// 	data.users.forEach((follower) => {
	// 		console.log(follower.name);
	// 	});
	// });
	// twit.get('statuses/user_timeline', {count: 5}, function(err, data, response){
	// 	data.forEach((tweet) => {
	// 		console.log(tweet.text);
	// 	});
	// })

});

app.listen(3000, () => console.log('port started on 3000'));
