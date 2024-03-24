import { OrderDetail } from "@/types/Order";
import Item from "./Item";

export default function ItemList({ data }: { data: OrderDetail }) {
  return (
    <div className="my-5 space-y-5">
      {data.items.map((item, index) => (
        <Item key={index} itemData={item} />
      ))}
    </div>
  );
}
