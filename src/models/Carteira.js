const mongoose = require('mongoose');

const { Schema } = mongoose;

const carteiraSchema = new Schema({
    moeda: {
        type: String,
        required: true,
    },
    saldo: {
        type: Number,
        required: true,
    },
    acoes: {
        type: [Object],
        required: true,
    }
}, { timestamps: true });

const Carteira = mongoose.model('Carteira', carteiraSchema);

module.exports = {
    Carteira,
    carteiraSchema,
};
