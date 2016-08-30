const Artwork = require ('../src/models/artwork');
const Show = require ('../src/models/show');
const art = require('./artwork.json');
const shows = require('./shows.json');
require ('../src/lib/setup-mongoose');

switch (process.argv[2]) {
case 'show':{
  shows.forEach(show => {
    new Show(show)
    .save()
    .then(newShow => {
      console.log(newShow);
    })
    .catch(err => {
      console.log('error: ', err);
    });
  });
  break;
}
case 'art': {
  art.forEach(work => {
    new Artwork(work)
    .save()
    .then(posted => {
      Show.findById(posted.showId)
      .then(show => {

        show.artworks.push(posted._id);
        show.save();
        console.log(`saved ${posted.title}.`);
      });
    })
    .catch(err => {
      console.log('error: ', err);
    });
  });
  break;
}
case 'cleanart': {
  Show.find()
  .then(shows => {
    return shows.map(show => {
      show.artworks = [];
      show.save();
    });
  })
  .then(shows => {
    console.log(shows);
  })
  .catch(err => {
    console.log('error: ', err);
  });
}
default: console.log('No option selected');
}

// mc.close();
