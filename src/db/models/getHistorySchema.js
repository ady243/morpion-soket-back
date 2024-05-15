const mongoose = require('mongoose');

const gameHistorySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    history: [Array(9).fill(null)]
});

module.exports = mongoose.model('GameHistory', gameHistorySchema);
