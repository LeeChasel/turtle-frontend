import FilteredProducts from "../components/Products/FilteredProducts"
import SideNavbar from "../components/Products/SideNavbar"

function Products() {
  return (
   // TODO: Move validate URL query logic to here
   <div className="flex p-12">
      <SideNavbar/>
      <FilteredProducts/>
    </div>
  )
}

export default Products