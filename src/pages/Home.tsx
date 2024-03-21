function Home() {
  return (
    <div className="flex flex-col items-center mt-2 md:mt-5 lg:mt-10 gap-[153px]">
      <div className="w-full max-w-[800px] mx-auto p-10 md:p-0">
        <img
          src={import.meta.env.VITE_TURTLE_FRONTEND_IMAGE_URL + "/ad.webp"}
          alt="ad image"
          loading="lazy"
          className="w-full h-full"
        />
      </div>
      {/* <ProductsContainer /> */}
    </div>
  );
}

// function ProductsContainer() {
//   return <div>The 10 best-selling products every week</div>;
// }

export default Home;
