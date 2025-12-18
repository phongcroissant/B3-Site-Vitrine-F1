import { useSelector, useDispatch } from "react-redux";
import { addOne, removeOne } from "../../../features/shopCart";

export default function Shop() {
  const shopList = useSelector((state) => state.shop);
  const dispatch = useDispatch();
  return (
    <>
      <h1 className="text-4xl text-slate-100 font-bold text-center pb-5">
        Shop
      </h1>
      <ul className="grid grid-cols-4 gap-4 justify-items-start mb-4 container mx-auto ">
        {shopList.list.map((shop) => (
          <li
            key={shop.id}
            className="bg-slate-100 p-4 w-75 rounded text-black mx-auto"
          >
            <div className="flex justify-between mb-4">
              <h2>{shop.name}</h2>
              <p>Prix : {shop.price} €</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => dispatch(addOne(shop))}
                className="w-full text-black p-1 rounded text-lg border bg-gray-200 hover:bg-gray-300"
              >
                Ajouter au panier
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
