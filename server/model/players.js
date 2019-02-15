const Model = require('./model');

class Players extends Model {
    constructor() {
        super();
        
        this.tableName = 'sg_players';
        this.partitionKey = 'playerId';
    }

    async getPlayer(playerId) {
        const options = {
            TableName: this.tableName, 
            Key: { playerId }
        };

        const player = await this.documentClient.get(options).promise();

        return player.Item;
    }

    async createPlayer(playerName) {
        const Item = {
            playerId: this.generateUniqueId(),
            playerName
        };

        const options = {
            TableName: this.tableName,
            Item
        };

        await this.documentClient.put(options).promise();

        return Item;
    }

    async deletePlayer(playerId) {
        const deleteOptions = {
            TableName: this.tableName, 
            Key: { playerId }
        };

        await this.documentClient.delete(deleteOptions).promise();

        const getOptions = {
            TableName: this.tableName,
            ReturnConsumedCapacity: 'TOTAL'
        };

        // for science, don't do a full collection scan in the real world
        const players = await this.documentClient.scan(getOptions).promise();

        console.log('Consumed Capacity:', players.ConsumedCapacity);

        return players.Items;
    }
}

module.exports = new Players();
