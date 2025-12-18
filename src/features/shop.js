import {createSlice} from "@reduxjs/toolkit"

const initialState= {
    list: [
        {
            name:"T-Shirt RedBull",
            price: 25,
            id:1
        },
        {
            name:"T-Shirt Ferrari",
            price: 30,
            id:2
        },
        {
            name:"T-Shirt McLaren",
            price: 25,
            id:3
        },
        {
            name:"T-Shirt Mercedes",
            price: 30,
            id:4
        },
        {
            name:"T-Shirt Williams",
            price: 30,
            id:5
        },
    ]
}

export const shop = createSlice( {
    name:"shop",
    initialState
})

export default shop.reducer