const express = require('express'),
	pug = require('pug'),
	midware = require('./middleware');

const app = express();
app.set('view engine', 'pug');
app.use('/static', express.static('public'));

//applyinh middleware to the root storing locals
app.get('/', [midware.getFriends, midware.getStatus, midware.getDms]);

app.get('/', (req, res) => {
	console.log(res.locals.tweets);
	res.render('layout');
});

app.listen(3000, () => console.log('port started on 3000'));
