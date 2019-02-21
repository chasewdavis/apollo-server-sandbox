const DataLoader = require('dataloader');
const playerLoader = require('./playerLoader');

const loaders = {
    playerLoader: new DataLoader(playerLoader),
    //anotherLoader : new DataLoader(anotherLoader)
};

module.exports = loaders;
