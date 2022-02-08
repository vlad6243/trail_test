import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import debounce from "lodash.debounce";
import { Container, Form, Spinner, Alert } from 'react-bootstrap'
import { fetchData } from '../../redux/actions/exchanger'
import { Types } from '../../redux/actions/exchanger'

export default function Exchanger() {
    const dispatch = useDispatch()
    const [ currencyAmount, isLoading, isError ] = useSelector(({ exchanger }) => [
        exchanger.currencyAmount,
        exchanger.isLoading,
        exchanger.isError
    ])
    const currency_codes = ['USD', 'ILS', 'EUR']
    const [ baseCurrency, setBaseCurrency ] = React.useState('USD')
    const [ quoteCurrency, setQuoteCurrency ] = React.useState('ILS')
    const [ baseAmount, setBaseAmount ] = React.useState('')
    const [ wrongValue, setWrogValue ] = React.useState(false)

    const updateQuery = (e) => setBaseAmount(e.target.value);
    const debouncedOnChange = debounce(updateQuery, 500);

    const getCurrencyAmount = React.useCallback((data) => {
        dispatch(fetchData(data))
    },[dispatch])

    const clearState = React.useCallback((data) => {
        dispatch({type: Types.CLEAR_DATA})
    },[dispatch])

    React.useEffect(() => {
        if( baseCurrency !== quoteCurrency && baseAmount > 0 ) {
            setWrogValue(false)
            getCurrencyAmount({
                baseCurrency,
                quoteCurrency,
                baseAmount
            })
        } else {
            if(baseAmount !== '') {
                clearState()
                setWrogValue(true) 
            }
        }
    },[baseCurrency, quoteCurrency, baseAmount])

    const CustomSelect = ({ defalutOption, stateValue, handlerValue }) => {
        return(
            <Form.Group className="mt-1">
                <Form.Label> {defalutOption} </Form.Label>
                <Form.Select 
                    value={stateValue} 
                    onChange={(e) => handlerValue(e.target.value)}
                >
                    {currency_codes.map( ( el, index ) => <option key={index} value={el}> {el} </option> )}
                </Form.Select>
            </Form.Group>
        )
    }

    const LoadingSpinner = () => {
        return (
            <div className='mt-3 d-flex justify-content-center'>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        )
    }

    const CurrencyAmount = ({currencyAmount}) => {
        return currencyAmount ? 
            (
                <div>
                    <hr/>
                    <h4>Received rate: {currencyAmount.exchange_rate}</h4>
                    <h4>Expected amount: {currencyAmount.amount}</h4>
                </div>
            ): <></>
    }

    const ErrorMessage = ({variant,message}) => {
        return (
            <Alert variant={variant} className='mt-3'>
                {message}
            </Alert>
        )
    }

    return(
        <Container className="mt-3">
            <CustomSelect 
                defalutOption="Base currency" 
                stateValue={baseCurrency} 
                handlerValue={setBaseCurrency}
            />
            <CustomSelect 
                defalutOption="Quote currency" 
                stateValue={quoteCurrency} 
                handlerValue={setQuoteCurrency}
            />
            <Form.Control
                onChange={debouncedOnChange}
                className="mt-3"
                type="number"
                placeholder="Base amount"
                min="1"
            />
            { isLoading ? <LoadingSpinner/> : <CurrencyAmount currencyAmount={currencyAmount} /> }
            { isError && <ErrorMessage variant={'danger'} message={'Something went wrong...' } /> }
            { wrongValue && <ErrorMessage variant={'warning'} message={'Wrong values...' } /> }
        </Container>
    )
}
