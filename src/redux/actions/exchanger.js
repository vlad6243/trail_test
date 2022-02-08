import { getCurrencyAmount } from '../../axios/queries'

export const Types = {
    SET_DATA: 'SET_DATA',
    LOADING: 'LOADING_START',
    LOADED: 'LOADING_FINISH',
    ERROR: 'LOADING_ERROR',
    CLEAR_DATA: 'CLEAR_DATA'
}

export const fetchData = data => async (dispatch) => {
        dispatch({type: Types.LOADING})
        await getCurrencyAmount(data)
            .then(result => {
                dispatch({
                    type: Types.SET_DATA,
                    payload: result.data
                })
            })
            .catch(err => {
                console.log(err)
                dispatch({type: Types.ERROR})
            })
}
