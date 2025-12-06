import ProductTabBar from "../components/product-tab-bar";

export default function TabLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="pb-20">{children}</div>
      <ProductTabBar />
    </div>
  );
}
