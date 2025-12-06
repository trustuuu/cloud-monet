import Image from "next/image";
import Link from "next/link";
import { formatToDallar, formatToTimeAgo } from "../lib/utils";

export interface ProductProps {
  title: string;
  price: number;
  created_at: Date;
  photo: string;
  id: number;
  //posts: Post[];
  _count: { likes: number };
}
export default function Product({
  title,
  price,
  created_at,
  photo,
  id,
  _count,
}: //posts,
ProductProps) {
  return (
    <Link href={`/products/${id}`} className="flex gap-5">
      <div className="relative size-28 rounded-md overflow-hidden">
        <Image
          priority
          fill
          src={`${photo}/avatar`}
          alt={title}
          sizes="(max-width: 96px), (max-width: 96px)"
          className="object-cover size-24"
          placeholder="blur"
          blurDataURL="data:immage/jpeg;base64, LGF5?xYk^6#M@-5c,1J5@[or[Q6."
        />
      </div>
      <div className="flex flex-col gap-1 *:text-white">
        <span className="text-lg">{title}</span>
        <span className="text-sm text-neutral-500">Likes ({_count.likes})</span>
        <span className="text-sm text-neutral-500">
          {formatToTimeAgo(created_at.toString())}
        </span>
        <span className="text-lg font-semibold">
          CAD: ${formatToDallar(price)}
        </span>
      </div>
    </Link>
  );
}
