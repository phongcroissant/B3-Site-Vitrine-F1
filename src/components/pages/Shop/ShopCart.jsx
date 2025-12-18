import { useSelector, useDispatch } from "react-redux";
import { removeOne } from "../../../features/shopCart";

export default function ShopCart() {
  const shopCart = useSelector((state) => state.shopCart);
  const dispatch = useDispatch();
  console.log(shopCart);

  return (
    <div className="bg-slate-100 rounded text-black mx-auto w-1/2 mt-5">
      <p className="text-2xl p-5 border-b border-slate-400">Votre panier</p>
      <ul>
        {shopCart.cart.length > 0 &&
          shopCart.cart.map((shop) => (
            <li className="px-5 py-2 text-xl flex items-center" key={shop.id}>
              <span className="font-semibold mr-2">{shop.quantity}</span>
              <span>{shop.name}</span>
              <button
                onClick={() => dispatch(removeOne(shop.id))}
                className="w-25 bg-red-600 hover:bg-red-500 text-slate-100 p-1 rounded ml-auto"
              >
                -1
              </button>
            </li>
          ))}
        {shopCart.cart.length === 0 && (
          <li className="px-5 py-5 text-xl font-semibold">
            ...Ajoutez un article
          </li>
        )}
      </ul>
      <p className="text-xl p-5 border-t border-slate-400">
        {" "}
        Prix total :{" "}
        {shopCart.cart.length > 0 && (
          <span>
            {shopCart.cart.reduce(
              (acc, item) => item.price * item.quantity + acc,
              0
            )}
            €
          </span>
        )}
      </p>
    </div>
  );
}
