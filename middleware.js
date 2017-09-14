const Twit = require('twit'),
			api = require('./config'),
			ta = require('time-ago')();

var twit = new Twit({
  consumer_key:         api.consumer_key,
  consumer_secret:      api.consumer_secret,
  access_token:         api.access_token,
  access_token_secret:  api.access_token_secret
});

/*TO-DO's
	get five most recent friends // -profile image -real name -screenname
	get five most recent tweets // -message content -# of retweets -# of likes -date tweeted
	get five most recent dm's // -message body -date the message was sent -time the message was sent
*/

let screen_name;

module.exports = {
	getScreenName: (req, res, next) => {
		twit.get('account/settings', (err, data, response) => {
			screen_name = data.screen_name;
			next();
		});
	},

	getFriends: (req, res, next) => {
		twit.get('friends/list', {count: 5, include_user_entities: false}, (err, data, response) => {
			res.locals.friends = [];
			data.users.forEach((follower) => {
				let [profile_img, name, screen_name] = [follower.profile_image_url, follower.name, follower.screen_name];
				let data = {
					profile_img,
					name,
					screen_name
				}
				res.locals.friends.push(data);
			});
			next();
		});
	},

	getStatus: (req, res, next) => {
		twit.get('statuses/user_timeline', {count: 5, include_rts: false, screen_name}, function(err, data, response){
			res.locals.tweets = [];
			let getTime = time => ta.ago(time);
			data.forEach((tweet) => {
				let [text, favorites, retweets, time] = [tweet.text, tweet.favorite_count, tweet.retweet_count, getTime(tweet.created_at)];
				let data = {
					text,
					favorites,
					retweets,
					time
				};
				res.locals.tweets.push(data);
			});
			next();
		});
	},

	getDms: (req, res, next) => {
		twit.get('direct_messages', {count: 5}, (err, data, response) => {
			res.locals.dms = [];
			data.forEach((msg) => {
				let [body, time, img] = [msg.text, msg.created_at, msg.sender.profile_background_image_url_https];
				let data = {
					body,
					time,
					img
				}
				res.locals.dms.push(data);
			});

			next();
		});
	}
}
