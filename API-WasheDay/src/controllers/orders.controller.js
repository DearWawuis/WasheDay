import orders from '../models/orders';
import { generatePaymentIntent, generatePaymentMethod, getPaymentDetail } from '../services/stripe';

//Generamos nueva orden y guardamos en base de datos
export const postItem = async (req, res) => {
    try {
        const { amount, name } = req.body
        const oderRes = await orders.create({
            name,
            amount
        })

        res.send({ data: oderRes })
    } catch (e) {
        res.status(500);
        res.send({ error: 'Algo ocurrio' })
    }
}

//Buscamos en la base de datos si existe una orden con el localizador
export const getItem = async (req, res) => {
    const { id } = req.params
    const userData = await orders.findOne({ localizator: id })
    res.send({ data: userData })
}



//Buscamos orden y genramos intencion de pago
export const updateItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { token } = req.body

        //Buscamos orden en nuestra base de datos

        const resOrder = await orders.findOne({ localizator: id })

        //Generamos metodo de pago en Stripe

        const responseMethod = await generatePaymentMethod(token)

        //Generamos intencion de pago

        const resPaymentIntent = await generatePaymentIntent(
            {
                amount: resOrder.amount,
                user: resOrder.name,
                payment_method: responseMethod.id
            }
        )

        //Actualizamos  orden con id de intencion de pago
        await orders.findOneAndUpdate({ localizator: id }, {
            stripeId: resPaymentIntent.id
        })

        res.send({ data: resPaymentIntent })

    } catch (e) {
        console.log(e.message)
        res.status(500);
        res.send({ error: 'Algo ocurrio' })
    }
}


//Buscamos orden y y solictamos a stripe los detalles
export const checkItem = async (req, res) => {
    try {
        const { id } = req.params;

        //Buscamos orden en nuestra base de datos

        const resOrder = await orders.findOne({ localizator: id })

        //Solicitamos a stripe que nos devuelva la informacion de la orden

        const detailStripe = await getPaymentDetail(resOrder.stripeId)

        const status = detailStripe.status.includes('succe') ? 'success' : 'fail'

        //Actualizamos nuestra orden con el estatus

        await orders.findOneAndUpdate({ localizator: id }, { status })

        res.send({ data: detailStripe })

    } catch (e) {
        console.log(e.message)
        res.status(500);
        res.send({ error: 'Algo ocurrio' })
    }
}