const Twit = require('twit'),
			api = require('./config');

var twit = new Twit({
  consumer_key:         api.consumer_key,
  consumer_secret:      api.consumer_secret,
  access_token:         api.access_token,
  access_token_secret:  api.access_token_secret
})

/*TO-DO's
	get five most recent friends // -message content -# of retweets -# of likes -date tweeted
	get five most recent tweets // -profile image -real name -screenname
	get five most recent dm's // -message body -date the message was sent -time the message was sent
*/

module.exports = {
	getFriends: function(req, res, next){
		twit.get('friends/list', {count: 5, include_user_entities: false}, (err, data, response) => {
			res.locals.friends = [];
			data.users.forEach((follower) => {
				res.locals.friends.push(follower.name);
			});
			next();
		});
	},

	getStatus: function(req, res, next){
		twit.get('statuses/user_timeline', {count: 5}, function(err, data, response){
			data.forEach((tweet) => {
				console.log(tweet);
			});
			next();
		});
	}
}
