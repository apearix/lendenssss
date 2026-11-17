import type { ReactNode } from "react";

// A template remounts the add form whenever this route is opened, so a
// previous submission cannot keep its fields or loading state.
export default function AddPersonTemplate({ children }: { children: ReactNode }) {
  return children;
}
