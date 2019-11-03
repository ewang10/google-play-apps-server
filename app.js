const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(morgan('dev'));

const apps = require('./apps-data');

app.get('/apps', (req, res) => {
    const {genres = '', sort} = req.query;
    if(sort) {
        if(!['rating', 'app'].includes(sort)) {
            return res
                .status(400)
                .send('Sort must be one of rating or app.');
        }
    }
    if(genres) {
        if(!['action', 'puzzle', 'strategy', 'casual', 'arcade', 'card'].includes(genres.toLowerCase())) {
            return res
                .status(400)
                .send('genres must be one of the following: Action, Puzzle, Strategy, Casual, Arcade, or Card');
        }
    }
    let results = apps.filter(app => app.Genres.toLowerCase().includes(genres.toLowerCase()));
    
    if(sort) {
        console.log("sorting...");
        results.sort((a, b) => {
            if (a > b) {
                return 1;
            } else if (a < b) {
                return -1;
            } else {
                return 0;
            }
            //return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
        });
    }
    
    res.json(results);
});

app.listen(8000, () => {
    console.log('Server started on PORT 8000');
});