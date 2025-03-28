const mongoose = require('mongoose');

const { Schema } = mongoose;

const alertaSchema = new Schema({
    moeda: {
        type: Number,
        required: true,
        default: 0, // Define um valor padrão caso não seja informado
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

const Alerta = mongoose.model('Alerta', alertaSchema);

module.exports = {
    Alerta,
    alertaSchema,
};