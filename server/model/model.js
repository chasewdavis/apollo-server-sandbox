const { AWS } = require('./config');

class Model {
    constructor() {
        this.documentClient = new AWS.DynamoDB.DocumentClient();
    }

    generateUniqueId() {
        let uniqueID = '';

        let chars = 'abcdef0123456789';
        chars = chars.split('');

        // 15^32 possible combinations
        for (let i = 0; i < 32; i++) {
            uniqueID += chars[Math.floor((Math.random() * 15))];
        }

        return uniqueID;
    }
}

module.exports = Model;
