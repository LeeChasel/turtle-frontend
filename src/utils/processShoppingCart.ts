import { TShoppingCartDetail, TShoppingCartBrief, TItemBrief } from "../types/ShoppingCart";

export function parseShoppingCart(detailedShoppingCart: TShoppingCartDetail)
{
  const resultBriefShoppingCart: TItemBrief[] = [];
  for (const item of detailedShoppingCart.shoppingCartItems) {
    const brief: TItemBrief = {
      productId: item.product.productId!,
      variationName: item.variation.variationName,
      variationSpec: item.variation.variationSpec,
      quantity: item.quantity,
      addedTime: item.addedTime
    };
    resultBriefShoppingCart.push(brief);
  }
  const shoppingCartBrief: TShoppingCartBrief = {
    shoppingCartItems: resultBriefShoppingCart
  };
  return shoppingCartBrief;
}

export function addNewItemToBriefShoppingCart(newItem: TItemBrief, originalBriefShoppingCart: TShoppingCartBrief)
{
  const newBriefs: TItemBrief[] = [...originalBriefShoppingCart.shoppingCartItems];
  const existingItem = newBriefs.find(item => 
    item.productId === newItem.productId &&
    item.variationName === newItem.variationName &&
    item.variationSpec === newItem.variationSpec
    );

  if (existingItem) {
    existingItem.quantity += newItem.quantity;
  } else {
    newBriefs.push(newItem);
  }
  const shoppingCartBrief: TShoppingCartBrief = {
    shoppingCartItems: newBriefs
  };
  return shoppingCartBrief;  
}