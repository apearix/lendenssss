import EditPersonClient from "./client";

export const instant = false;

export default async function EditPersonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditPersonClient personId={id} />;
}
