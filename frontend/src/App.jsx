import { Routes, Route } from "react-router-dom";
import { Signup } from "./pages/Signup";
import { Login } from "./pages/Login";
import { Products } from "./pages/Products";
import { Cart } from "./pages/Cart";
import { Checkout } from "./pages/Checkout";

function App(){
  return(
    <>
      <Routes>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/' element={<Login/>}/>
        <Route path='/products' element={<Products/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/checkout' element={<Checkout/>}/>
      </Routes>
    </>
  )
}

export default App