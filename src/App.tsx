import { Routes, Route, useLocation } from "react-router-dom";
import { Home, LoginOrSignup, NewProducts, Product, Products, ShoppingCart, UserSetting, UpdatePassword, Notfound_404, AddProduct } from './pages/Index';
import RootLayout from './components/RootLayout';
import UserNav from "./components/UserNav";
import { useEffect } from "react";

function App() {
  const { pathname } = useLocation();
  const decodePathName = decodeURI(pathname);
  useEffect(() => {
    if (decodePathName.startsWith('/product/')) {
      const pathArray = decodePathName.replace(/^\//, '').split("/");
      const productName = pathArray[pathArray.length - 1];
      document.title = productName + ' | LazyTurtle';
    } else {
      document.title = 'Lazy Turtle';
    }
  }, [decodePathName]);

  return (
    <RootLayout>
      <Routes>
        <Route path='/' index={true} element={<Home/>}/>
        <Route path="product/:productName" element={<Product/>} />
        <Route path='products' element={<Products/>} />
        <Route path='loginOrSignup' element={<LoginOrSignup/>} />
        <Route path='shoppingCart' element={<ShoppingCart/>} />
        <Route path='newProducts' element={<NewProducts/>} />
        <Route path="user" element={<UserNav/>}>
          <Route path="setting" element={<UserSetting/>}/>
          <Route path="updatePassword" element={<UpdatePassword/>}/>
          <Route path="addProduct" element={<AddProduct/>}/>
        </Route>
        <Route path="*" element={<Notfound_404/>}/>
      </Routes>
    </RootLayout>
  )
}

export default App
