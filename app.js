const express = require('express'),
	pug = require('pug'),
	midware = require('./middleware');

const app = express();
app.set('view engine', 'pug');
app.use('/static', express.static('public'));

//applying middleware to the root storing locals
app.get('/', [midware.getFriends, midware.getStatus, midware.getDms]);

app.get('/', (req, res) => {
	const friends = res.locals.friends;
	const tweets = res.locals.tweets;
	const dms = res.locals.dms;
	const user = res.locals.user;

	let msgsWithUsernames = dms.reduce((acc, dm) => {
		if(acc.indexOf(dm.name) == -1){
			acc.push(dm.name);
		}
		return acc;
	}, []);

	res.render('layout', {user, friends, tweets, dms, msgsWithUsernames});
});

app.listen(3000, () => console.log('port started on 3000'));
