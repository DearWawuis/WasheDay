import { Schema, model } from 'mongoose';

const orderServiceSchema = new Schema({
    userWashoId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    washerId: {
        type: Schema.Types.ObjectId,
        ref: 'Washer',
        required: true
    },
    serviceId: {
        type: Number,
        required: true
    },
    estimatedDeliveryDate: {
        type: Date,
        required: false
    },
    deliveryDate: {
        type: Date,
        required: false
    },
    kg: {
        type: Number,
        required: false
    },
    total: {
        type: Number,
        required: false
    },
    payType: {
        type: String,
        enum: ['Pago efectivo contra entrega', 'Pago tarjeta débito/crédito'],
        default: 'Pago efectivo contra entrega'
    },
    orderStripeId: {
        type: Schema.Types.ObjectId,
        required: false,
        default: null
    },
    status: {
        type: String,
        enum: ['Creada', 'Aceptada', 'Cancelada', 'Cotizada', 'Pago efectivo', 'Pago tarjeta', 'Lavando', 'Secando', 'Finalizado', 'Entregado'],
        default: 'Creada'
    },
    detergents: [{
        type: Schema.Types.ObjectId,
        ref: 'Washer.detergents',
        required: true
    }],
    rating: { type: Number, min: 1, max: 5, required: false }, 
    comment: { type: String, required: false }, 
}, {
    timestamps: true,
    versionKey: false
});

export default model('OrderService', orderServiceSchema);
