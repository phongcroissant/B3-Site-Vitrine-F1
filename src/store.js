import {configureStore} from "@reduxjs/toolkit"
import shop from "./features/shop"
import shopCart from "./features/shopCart"

export const store = configureStore({
    reducer:{
        shop,
        shopCart
    }
})