import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api',
})

export async function getCurrencyAmount(data) {
    return await axiosInstance
        .get(`/quote?from_currency_code=${data.baseCurrency}&` + 
                `amount=${data.baseAmount}&` + 
                `to_currency_code=${data.quoteCurrency}`
            );
}