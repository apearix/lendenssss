import PersonDetailsClient from "./client";

export const instant = false;

export default async function PersonDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PersonDetailsClient personId={id} />;
}
