function Home() {
  return (
    <div className="flex flex-col items-center mt-[185px] gap-[153px]">
      <div className="h-[468px] w-full -mx-[260px] px-[160px]">
        <div className="h-full bg-white">ad</div>
      </div>
      <ProductsContainer/>
      {/* <div className="grid grid-cols-3 gap-[100px] w-full px-[260px]"></div> */}
    </div>
  )
}

function ProductsContainer() {
  return <div>The 10 best-selling products every week</div>
}

export default Home