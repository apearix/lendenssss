import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { LedgerEntry } from "@/lib/ledger";

function toEntry(item: Awaited<ReturnType<typeof api.activity>>[number]): LedgerEntry {
  return { id: item.id, personId: item.contactId, personName: item.contactName, kind: item.type === "I_GAVE" ? "given" : "repayment", amount: item.amount, date: item.date.slice(0, 10), note: item.note || "", dueDate: item.dueDate?.slice(0, 10) };
}

export function useLedger() {
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [ready, setReady] = useState(false);
  const refresh = useCallback(async () => { try { setEntries((await api.activity()).map(toEntry)); } finally { setReady(true); } }, []);
  useEffect(() => { void refresh(); }, [refresh]);

  return { entries, setEntries, ready, refresh };
}
