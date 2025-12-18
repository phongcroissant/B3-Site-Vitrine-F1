import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cart:[

    ]
}

export const shopCart = createSlice ({
    name:"shopCart",
    initialState,
    reducers:{
        addOne: (state,action)=>{
            const shopIndex=state.cart.findIndex(obj => obj.id=== action.payload.id)

            if (shopIndex !== -1) {
                state.cart[shopIndex].quantity++
            } else {
                state.cart.push({...action.payload, quantity:1})
            }
        },
        removeOne:(state,action)=> {
            const shop = state.cart.find(obj=> obj.id === action.payload)
            if(shop) {
                if(shop.quantity===1) {
                    state.cart=state.cart.filter(shop=> shop.id !== action.payload)
                } else {
                    shop.quantity--
                }
            }
        }
    }
})

export const {addOne, removeOne}=shopCart.actions
export default shopCart.reducer