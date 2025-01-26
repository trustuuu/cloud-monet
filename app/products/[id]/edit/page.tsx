import { notFound } from "next/navigation";

export default function Edit({ params }: { params: { id: string } }) {
  console.log("edit", params.id);
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }

  return <div>Product Edit - {id} </div>;
}
