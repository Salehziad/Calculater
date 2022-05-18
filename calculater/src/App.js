import React, {useReducer} from 'react'
import './style.css'
import Digit from './Digit'
import Operation from './Operation'

export const ACTIONS = {
    ADD_DIGIT: 'addDigit',
    CLEAR_DIGIT: 'clear',
    DELETE_DIGIT: 'deleteDigit',
    CHOSEN_OPERATION: 'chosenoperation',
    EVALUATE: 'evaluate'
}

function reducer(state, {type, payload}) {
    switch (type) {
        case ACTIONS.ADD_DIGIT:
            if (state.overWrite) {
                return {
                    ...state,
                    currentValue: payload.digit,
                    overWrite: false
                }
            }
            if (payload.digit === "0" && state.currentValue === "0") {
                return state
            }
            // if (payload.digit === "." && state.currentValue.includes('.')) {
            //     return state
            // }
            return {
                ...state,
                currentValue: `${state.currentValue || ''}${payload.digit}`
            }
        case ACTIONS.CLEAR_DIGIT:
            return {}
        case ACTIONS.CHOSEN_OPERATION:
            if (state.currentValue == null && state.previousValue == null) {
                return state
            }
            if (state.currentValue == null) {
                return {
                    ...state,
                    operation: payload.operation
                }
            }
            if (state.previousValue == null) {
                return {
                    ...state,
                    operation: payload.operation,
                    previousValue: state.currentValue,
                    currentValue: null
                }
            }
            return {
                ...state,
                previousValue: evaluate(state),
                operation: payload.operation,
                currentValue: null
            }
        case ACTIONS.EVALUATE:
            if (state.currentValue === null || state.previousValue === null || state.operation == null) {
                return {
                    ...state,
                    previousValue: state.currentValue
                }
            }
            return {
                ...state,
                overWrite: true,
                previousValue: null,
                operation: null,
                currentValue: evaluate(state)
            }
        case ACTIONS.DELETE_DIGIT:
            if (state.overWrite) {
                return {
                    ...state,
                    overWrite: false,
                    currentValue: null
                }
            }
            if (state.currentValue == null) 
                return state;
            
            if (state.currentValue.length === 0) {
                return {
                    ...state,
                    currentValue: null
                }
            }
            return {
                ...state,
                currentValue: state
                    .currentValue
                    .slice(0, -1)
            }
        default:;
    }
}

function evaluate({currentValue, previousValue, operation}) {
    const prev = parseFloat(previousValue)
    const curent = parseFloat(currentValue)
    if (isNaN(prev) || isNaN(curent)) 
        return "";
    
    let computation = "";
    switch (operation) {
        case "+":
            computation = prev + curent
            break;
        case "-":
            computation = prev - curent
            break
        case "*":
            computation = prev * curent
            break
        case "÷":
            computation = prev / curent
            break
        default:;
    }
    return computation.toString();
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {maximumFractionDigits: 0})

function formatOperand(operand) {
    if (operand == null) 
        return
    const [integer,
        decimal] = operand.split(".")
    if (decimal == null) 
        return INTEGER_FORMATTER.format(integer)
    return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

export default function App() {
    const [
        {
            currentValue,
            previousValue,
            operation
        },
        dispatch] = useReducer(reducer, {})

    return (
        <div className='calculater-grid'>
            <div className='outpit'>
                <div className='previos-output'>{formatOperand(previousValue)}{operation}</div>
                <div className='current-output'>{formatOperand(currentValue)}</div>
            </div>
            <button
                className='span-tow'
                onClick={() => dispatch({type: ACTIONS.CLEAR_DIGIT})}>AC</button>
            <button onClick={() => dispatch({type: ACTIONS.DELETE_DIGIT})}>DEL</button>
            <Operation operation="÷" dispatch={dispatch}/>
            <Digit digit="1" dispatch={dispatch}/>
            <Digit digit="2" dispatch={dispatch}/>
            <Digit digit="3" dispatch={dispatch}/>
            <Operation operation="*" dispatch={dispatch}/>
            <Digit digit="4" dispatch={dispatch}/>
            <Digit digit="5" dispatch={dispatch}/>
            <Digit digit="6" dispatch={dispatch}/>
            <Operation operation="+" dispatch={dispatch}/>
            <Digit digit="7" dispatch={dispatch}/>
            <Digit digit="8" dispatch={dispatch}/>
            <Digit digit="9" dispatch={dispatch}/>
            <Operation operation="-" dispatch={dispatch}/>
            <Digit digit="0" dispatch={dispatch}/>
            <Digit digit="." dispatch={dispatch}/>
            <button className='span-tow' onClick={() => dispatch({type: ACTIONS.EVALUATE})}>=</button>
        </div>
    )
}
