const Model = require('../root');

class GameRooms extends Model {
    constructor() {
        super();
        
        this.tableName = 'sg_gameRooms';
    }

    async createGameRoom({ gameRoomName, playerId }) {
        const Item = {
            gameRoomId: this.generateUniqueId(),
            createdAt: this.generateTimestamp(),
            createdBy: playerId,
            gameRoomName
        };

        const params = {
            TableName: this.tableName,
            Item
        };

        await this.documentClient.put(params).promise();

        return Item;
    }

    async getGameRoom(gameRoomId) {
        const params = {
            TableName: this.tableName,
            Key: { gameRoomId }
        };

        const gameRoom = await this.documentClient.get(params).promise();

        return gameRoom.Item;
    }
}

module.exports = new GameRooms();
