const Model = require('./model');

class GameRooms extends Model {
    constructor() {
        super();
        
        this.tableName = 'sg_gameRooms';
    }
}

module.exports = new GameRooms();
