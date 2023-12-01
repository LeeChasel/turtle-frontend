import { GrFormAdd, GrFormSubtract } from 'react-icons/gr';
import { useState } from "react";
import { useVariationContext } from "../../Provider/VariationProvider";
import { useProductContext } from "../../Provider/ProductProvider";
import { showToast } from "../../utils/toastAlert";
import { addNewItemToBriefShoppingCart, parseShoppingCart } from '../../utils/processShoppingCart';
import useUserTokenCookie from '../../hooks/useUserTokenCookie';
import { TItemBrief } from '../../types/ShoppingCart';
import getShoppingCart from '../../actions/getShoppingCart';
import updateShoppingCart from '../../actions/updateShoppingCart';

export default function PurchaseInfo() {
  const [ itemNumber, setItemNumber ] = useState(1);
  const [ addingToShoppingCart, setAddingToShoppingCart ] = useState(false);
  const { variation } = useVariationContext();
  const { product } = useProductContext();
  const { tokenCookie } = useUserTokenCookie();

  function modifyNumber(action: "add" | "subtract") {
    if (itemNumber === 1 && action === "subtract") return;
    if (action === "add") {
      setItemNumber(prev => prev + 1);
    } else {
      setItemNumber(prev => prev - 1);
    }
  }

  function handlePurchase() {
    showToast("success", "直接購買，導向創造訂單頁面");
  }

  async function handleAddToShoppingCart() {
    try {
      setAddingToShoppingCart(true);
      if (!tokenCookie) {
        throw new Error('身分驗證錯誤，請登入！');
      }
      const shoppingCartDetailInfo = await getShoppingCart(tokenCookie);
      const briefShoppingCart = parseShoppingCart(shoppingCartDetailInfo);
      const newItem: TItemBrief = {
        productId: product.productId!,
        variationName: variation.variationName,
        variationSpec: variation.variationSpec,
        quantity: itemNumber,
        addedTime: new Date().toISOString()
      };
      const newBriefs = addNewItemToBriefShoppingCart(newItem, briefShoppingCart);
      updateShoppingCart(newBriefs, tokenCookie)
        .then(() =>  showToast('success', `成功新增商品「${product.productName}」到購物車！`));
    } catch (error) {
      if (error instanceof Error) {
        showToast('error', error.message);
      }
    } finally {
      setAddingToShoppingCart(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="items-center join">
        <button onClick={() => modifyNumber("subtract")} className="join-item btn">
          <GrFormSubtract className="w-7 h-7"/>
        </button>
        <div className="text-xl pointer-events-none join-item btn">{itemNumber}</div>
        <button onClick={() => modifyNumber("add")} className="join-item btn">
          <GrFormAdd className="w-7 h-7"/>
        </button>
      </div>
      <div>
        <button onClick={handlePurchase} className="mr-3 btn btn-lg">直接購買</button>
        <button onClick={handleAddToShoppingCart} className="btn btn-lg" disabled={addingToShoppingCart}>加入購物車</button>
      </div>
    </div>
  )
}