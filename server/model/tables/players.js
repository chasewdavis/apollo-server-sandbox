const Model = require('../root');

class Players extends Model {
    constructor() {
        super();
        
        this.tableName = 'sg_players';
        this.partitionKey = 'playerId';
    }

    async getPlayers(playerIds) {
        const Keys = playerIds.map(playerId => ({ 
            playerId
        }));

        const params = {
            RequestItems: {
                [this.tableName]: {
                    Keys,
                    ExpressionAttributeNames: {
                        '#playerId': 'playerId',
                        '#playerName': 'playerName'
                    },
                    ProjectionExpression: `
                        #playerId,
                        #playerName
                    `
                }
            }
        };
        
        const result = await this.documentClient.batchGet(params).promise();

        const players = result.Responses[this.tableName];
        
        const mappedPlayers = playerIds.map(id => players.find(player => player.playerId === id));

        return mappedPlayers;
    }

    async createPlayer(playerName) {
        const Item = {
            playerId: this.generateUniqueId(),
            createdAt: this.generateTimestamp(),
            playerName
        };

        const params = {
            TableName: this.tableName,
            Item
        };

        await this.documentClient.put(params).promise();

        return Item;
    }

    async deletePlayer(playerId) {
        const deleteparams = {
            TableName: this.tableName, 
            Key: { playerId }
        };

        await this.documentClient.delete(deleteparams).promise();

        const getparams = {
            TableName: this.tableName,
            ReturnConsumedCapacity: 'TOTAL'
        };

        // for science, don't do a full collection scan in the real world
        const players = await this.documentClient.scan(getparams).promise();

        console.log('Consumed Capacity:', players.ConsumedCapacity);

        return players.Items;
    }
}

module.exports = new Players();
