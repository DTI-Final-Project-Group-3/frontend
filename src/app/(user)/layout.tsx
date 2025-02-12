// import Cart from "@/components/cart/Cart";
// import Footer from "@/components/footer/Footer";
// import Navbar from "@/components/navbar/Navbar";

export default function UserLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {/* <Navbar />
      <Cart /> */}
      <main>{children}</main>
      {/* <Footer /> */}
    </>
  );
}
