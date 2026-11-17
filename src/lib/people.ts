export type Person = {
  id: string;
  name: string;
  phone: string;
  note: string;
  initials: string;
  amount: number;
  direction: "receive" | "pay";
  avatar?: string;
};

export const INITIAL_PEOPLE: Person[] = [
  { id: "rahul-sharma", name: "Rahul Sharma", phone: "+91 98765 43210", note: "Friend", initials: "RS", amount: 5000, direction: "receive" },
  { id: "priya-verma", name: "Priya Verma", phone: "+91 98765 43211", note: "Colleague", initials: "PV", amount: 2500, direction: "pay" },
  { id: "amit-patel", name: "Amit Patel", phone: "+91 98765 43212", note: "Friend", initials: "AP", amount: 8000, direction: "receive" },
  { id: "neha-singh", name: "Neha Singh", phone: "+91 98765 43213", note: "Friend", initials: "NS", amount: 5000, direction: "receive" },
  { id: "rohan-gupta", name: "Rohan Gupta", phone: "+91 98765 43214", note: "Colleague", initials: "RG", amount: 3000, direction: "pay" },
];

export function makeInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function formatRupees(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}
