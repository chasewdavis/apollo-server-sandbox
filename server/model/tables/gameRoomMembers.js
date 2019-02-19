const Model = require('../root');

const PLAYER_JOINED = 'PLAYER_JOINED';
const PLAYER_LEFT = 'PLAYER_LEFT';

class GameRoomMembers extends Model {
    constructor() {
        super();

        this.tableName = 'sg_gameRoomMembers';
    }

    async gameRoomStatusUpdate({ playerId, gameRoomId, playerStatus = 'ACTIVE' }) {
        const timestamp = this.generateTimestamp();

        const params = {   
            TableName: this.tableName,
            Key: { 
                gameRoomId,
                playerId
            },
            UpdateExpression: `SET
                #status_placeholder = :playerStatus, 
                #last_access_at_placeholder = :lastAccessAt
            `,
            ExpressionAttributeNames: {
                '#status_placeholder': 'playerStatus',
                '#last_access_at_placeholder': 'lastAccessAt'
            },
            ExpressionAttributeValues: {
                ':playerStatus': playerStatus,
                ':lastAccessAt': timestamp
            },
            ReturnValues: 'ALL_NEW'
        };

        const result = await this.documentClient.update(params).promise();
        const pubsubKey = playerStatus === 'ACTIVE' ? PLAYER_JOINED : PLAYER_LEFT;
        await this.pubsub.publish(pubsubKey, { playerJoined: { playerId }, gameRoomId });
        return result.Attributes;
    }

    async gameRoomMembers(gameRoomId) {
        const params = {
            TableName: this.tableName,
            IndexName: 'gameRoomId-playerId-index',
            KeyConditionExpression: 'gameRoomId = :game_room_id',
            ExpressionAttributeValues: { ':game_room_id': gameRoomId }
        };

        const result = await this.documentClient.query(params).promise();

        return result.Items;
    }
}

module.exports = new GameRoomMembers();
