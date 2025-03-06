"use client";

import { useEffect, useRef, useState } from "react";
import Product from "./product";
import { getMoreProduct } from "../(tabs)/home/actions";
import { Products } from "../(tabs)/life/page";

interface ProductProps {
  initialProducts: Products;
}

export default function ProductList({ initialProducts }: ProductProps) {
  const [products, setProducts] = useState(initialProducts);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [islastPage, setIsLastPage] = useState(false);
  const trigger = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      async (
        entries: IntersectionObserverEntry[],
        observer: IntersectionObserver
      ) => {
        const element = entries[0];
        if (element.isIntersecting && trigger.current) {
          observer.unobserve(trigger.current);
          setIsLoading(true);

          try {
            const newProducts = await getMoreProduct(page + 1);
            if (newProducts.length !== 0) {
              console.log(
                "setProducts((prev) => [...prev, ...newProducts]);",
                [...products, ...newProducts],
                "next page",
                page + 1
              );
              setPage((prev) => prev + 1);
              setProducts((prev) => [...prev, ...newProducts]);
            } else {
              setIsLastPage(true);
            }
          } catch (error) {
            console.error("Error fetching more products:", error);
          } finally {
            setIsLoading(false);
          }
        }
      },
      {
        threshold: 1,
        rootMargin: "0px 0px -10px 0px",
      }
    );
    if (trigger.current) {
      observer.observe(trigger.current);
    }
    return () => {
      observer.disconnect();
    };
  }, [page]);

  console.log("final products", products);
  return (
    <div className="p-5 flex flex-col gap-5">
      {products.map((product) => (
        <Product key={product.id} {...product} />
      ))}
      {islastPage ? null : (
        <span
          ref={trigger}
          className="mb-96 text-sm font-semibold bg-orange-500 w-fit mx-auto px-3 py-2 rounded-md hover:opacity-90 active:scale-95"
        >
          {isLoading ? "Loadding.." : "Load More"}
        </span>
      )}
    </div>
  );
}
