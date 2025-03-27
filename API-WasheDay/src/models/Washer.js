import { Schema, model } from 'mongoose';

const washerProfileSchema = new Schema({
    name: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: false
    },
    latitude: {
        type: Number,
        required: false
    },
    longitude: {
        type: Number,
        required: false
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    openingHours: {
        Lunes: {
            active: { type: Boolean, default: false }, 
            openingTime: { type: String, required: false }, 
            closingTime: { type: String, required: false } 
        },
        Martes: {
            active: { type: Boolean, default: false },
            openingTime: { type: String, required: false },
            closingTime: { type: String, required: false }
        },
        Miércoles: {
            active: { type: Boolean, default: false },
            openingTime: { type: String, required: false },
            closingTime: { type: String, required: false }
        },
        Jueves: {
            active: { type: Boolean, default: false },
            openingTime: { type: String, required: false },
            closingTime: { type: String, required: false }
        },
        Viernes: {
            active: { type: Boolean, default: false },
            openingTime: { type: String, required: false },
            closingTime: { type: String, required: false }
        },
        Sábado: {
            active: { type: Boolean, default: false },
            openingTime: { type: String, required: false },
            closingTime: { type: String, required: false }
        },
        Domingo: {
            active: { type: Boolean, default: false },
            openingTime: { type: String, required: false },
            closingTime: { type: String, required: false }
        }
    },
    services: {
        type: [{
            _id: { type: Number, enum: [1, 2, 3], required: true },
            name: { type: String, 
                enum: [
                "Servicio de lavado normal", 
                "Servicio de lavado Express", 
                "Servicio a domicilio"], required: true },
            active: { type: Boolean, default: false }
        }],
        default: [
            { _id: 1, name: "Servicio de lavado normal", active: true },
            { _id: 2, name: "Servicio de lavado Express", active: false },
            { _id: 3, name: "Servicio a domicilio", active: false }
        ]
    },
    detergents: {
        type: [{
            name: { type: String, required: true },
            active: { type: Boolean, default: false }
        }],
        default: [
            { name: "Ariel", active: false },
            { name: "Foca", active: false },
            { name: "Ace", active: false }
        ]
    },
    status: {
        type: String,
        enum: ['Abierto', 'Cerrado'],
        default: 'Cerrado'
    }
}, {
    timestamps: true,
    versionKey: false
});


export default model('Washer', washerProfileSchema);
