import { OrderDetail } from "@/types/Order";
import Item from "./Item";

export default function ItemList({ data }: { data: OrderDetail }) {
  return (
    <div className="my-5 space-y-5">
      {data.items.map((_item, index) => (
        <Item key={index} data={data} itemIndex={index} />
      ))}
    </div>
  );
}
