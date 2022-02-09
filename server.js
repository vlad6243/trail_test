const express = require('express')
const cors = require('cors')
const NodeCache = require('node-cache')
const axios = require('axios')

const port = 5000
const app = express()
const cache = new NodeCache({ stdTTL: 15 })
const { apiUrl } = require('./configs/keys')
app.use(cors())

const verifyCache = (req, res, next) => {
    const { 
        from_currency_code,
        amount,
        to_currency_code
    } = req.query
    const key = from_currency_code.concat('-', to_currency_code)

    try {
        if (cache.has(key)) {
            const rate = cache.get(key)
            return res.status(200).json({
                exchange_rate: rate,
                currency_code: to_currency_code,
                amount: amount * rate,
            })
        }

        return next()
    } catch (err) {
        res.status(400).json({
            message: 'Something happened'
        })
    }
}

app.get('/api/quote', verifyCache, async (req, res) => {
    const { 
        from_currency_code, 
        amount, 
        to_currency_code 
    } = req.query
    const key = from_currency_code.concat('-', to_currency_code)

    try {
        const { data } = 
            await axios.get(apiUrl + from_currency_code)
            .then( result => result.data )

        const exchange_rate = data[to_currency_code].toFixed(2)
        cache.set(key, exchange_rate)

        return res.status(200).json({
            exchange_rate: exchange_rate,
            currency_code: to_currency_code,
            amount: amount * exchange_rate,
        })
    } catch (err) {
        res.status(400).json({
            message: 'Something happened'
        })
    }
})

app.listen(port, () => console.log(`Server start port: ${port}`))
