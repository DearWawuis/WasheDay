import {Schema, model} from 'mongoose'
import { randomUUID } from 'crypto';

const ordersSchema = new Schema({
    name: {
        type: String
    },
    amount: {
        type: Number
    },
    localizator: {
        type: String,
        default: () => randomUUID(),
    },
    stripeId: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: ['success', 'fail', 'wait'],
        default: 'wait'
    }
},
    {
        timestamps: true,
        versionKey: false
    })

//module.exports = mongoose.model('orders', ordersSchema);
export default model('orders', ordersSchema);