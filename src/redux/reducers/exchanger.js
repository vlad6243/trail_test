import { Types } from '../actions/exchanger'

const initialState = {
    currencyAmount: null,
    isLoading: false,
    isError: false
}

export default function exchangerReducer(state = initialState, action) {
    switch (action.type) {
        case Types.LOADING:
            return {
                ...state, 
                isLoading: true
            }
        case Types.LOADED: 
            return {
                ...state, 
                isLoading: false
            }
        case Types.ERROR: 
            return {
                ...state,
                isLoading: false,
                isError: true
            }
        case Types.CLEAR_DATA: 
            return {
                ...state,
                currencyAmount: null,
            }
        case Types.SET_DATA:
            return {
                ...state,
                currencyAmount: action.payload,
                isLoading: false,
                isError: false
            }
        default:
            return state
    }
}
