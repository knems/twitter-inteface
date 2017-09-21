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
let getTime = time => ta.ago(time);

module.exports = {
	getScreenName: (req, res, next) => {
		twit.get('account/settings', (err, data, response) => {
			screen_name = data.screen_name;
			next();
		});
	},

	getFriends: (req, res, next) => {
		twit.get('friends/list', {count: 5}, (err, data, response) => {
			res.locals.friends = [];
			console.log(data);
			data.users.forEach((follower) => {
				let [profile_img, name, screen_name, following] = [follower.profile_image_url, follower.name, follower.screen_name, follower.following];
				res.locals.friends.push({
					profile_img,
					name,
					screen_name,
					following
				});
			});
			next();
		});
	},

	getStatus: (req, res, next) => {
		twit.get('statuses/user_timeline', {count: 5, include_rts: false, screen_name}, function(err, data, response){

			res.locals.user = {
				name: data[0].user.name,
				screen_name: data[0].user.screen_name,
				profile_img: data[0].user.profile_image_url_https,
				background: data[0].user.profile_banner_url
			}
			res.locals.tweets = [];

			data.forEach((tweet) => {
				let [text, favorites, retweets, time] = [tweet.text, tweet.favorite_count, tweet.retweet_count, getTime(tweet.created_at)];
				res.locals.tweets.push({
					text,
					favorites,
					retweets,
					time
				});
			});
			next();
		});
	},

	getDms: (req, res, next) => {
		twit.get('direct_messages', {count: 5}, (err, data, response) => {
			res.locals.dms = [];
			data.forEach((msg) => {
				let [body, time, img, name] = [msg.text, getTime(msg.created_at), msg.sender.profile_image_url_https, msg.sender.name];
				res.locals.dms.push({
					body,
					time,
					img,
					name
				});
			});

			next();
		});
	}
}
