export type EntryKind = "given" | "received" | "repayment";

export type LedgerEntry = {
  id: string;
  personId: string;
  personName: string;
  kind: EntryKind;
  amount: number;
  date: string;
  note: string;
  dueDate?: string;
};

export const INITIAL_ENTRIES: LedgerEntry[] = [
  { id: "entry-rahul-given", personId: "rahul-sharma", personName: "Rahul Sharma", kind: "given", amount: 6000, date: "2026-11-01", note: "" },
  { id: "entry-priya-received", personId: "priya-verma", personName: "Priya Verma", kind: "received", amount: 2500, date: "2026-10-30", note: "" },
  { id: "entry-amit-given", personId: "amit-patel", personName: "Amit Patel", kind: "given", amount: 8000, date: "2026-10-28", note: "" },
  { id: "entry-neha-given", personId: "neha-singh", personName: "Neha Singh", kind: "given", amount: 5000, date: "2026-11-02", note: "" },
  { id: "entry-rohan-received", personId: "rohan-gupta", personName: "Rohan Gupta", kind: "received", amount: 3000, date: "2026-10-26", note: "" },
  { id: "entry-rahul-repayment", personId: "rahul-sharma", personName: "Rahul Sharma", kind: "repayment", amount: 1000, date: "2026-11-02", note: "Partial repayment" },
];

export function entryBalance(entries: LedgerEntry[], personId: string) {
  return entries.filter((entry) => entry.personId === personId).reduce((balance, entry) => {
    if (entry.kind === "given") return balance + entry.amount;
    return balance - entry.amount;
  }, 0);
}

export function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
