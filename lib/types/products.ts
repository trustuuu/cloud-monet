import {
  getMessage,
  getMoreProduct,
  getProduct,
  getRoomsByProduct,
  getRoomsByUser,
} from "@/app/products/productDML";

export type Products = Awaited<ReturnType<typeof getMoreProduct>>;
export type initialMessagesType = Awaited<ReturnType<typeof getMessage>>;
export type RoomListUserType = Awaited<ReturnType<typeof getRoomsByUser>>;
export type RoomListType = Awaited<ReturnType<typeof getRoomsByProduct>>;
export type EditProductType = Awaited<ReturnType<typeof getProduct>>;
