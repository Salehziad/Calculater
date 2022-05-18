import React from 'react'
import {ACTIONS} from './App'
export default function Operation({dispatch, operation}) {
    return (
        <button
            onClick={() => dispatch({
                type:ACTIONS.CHOSEN_OPERATION,payload:{operation}
            })}>{operation}</button>
    )
}
