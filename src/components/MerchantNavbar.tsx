import { Link, Outlet } from "react-router-dom";
function MerchantNavbar() {
  return (
    <div className="flex gap-2 p-5">
      <nav>
        <ul className="w-40 gap-2 menu bg-white h-52 border border-black">
          <li>
            <Link to="/admin/orderProcessing">訂單資訊</Link>
          </li>
        </ul>
      </nav>
      <section className="w-3/4">
        <Outlet />
      </section>
    </div>
  );
}
export default MerchantNavbar;
