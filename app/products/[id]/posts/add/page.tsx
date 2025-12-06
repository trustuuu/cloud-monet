import AddPostForm from "./AddPostForm"; // Import the new component

export default async function AddPost({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ photo: string }>;
}) {
  // ✅ Keep this component ASYNC to resolve the PROMISE props
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const id = Number(resolvedParams.id);
  const photo = Number(resolvedSearchParams.photo);

  return (
    // ✅ Render the synchronous Client Component with resolved values
    <AddPostForm productId={id} productPhoto={photo} />
  );
}
