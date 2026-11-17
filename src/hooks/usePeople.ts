import { useCallback, useEffect, useState } from "react";
import { api, type ApiContact } from "@/lib/api";
import type { Person } from "@/lib/people";

function toPerson(contact: ApiContact): Person {
  return { id: contact.id, name: contact.fullName, phone: contact.phoneNumber, note: contact.note || "", initials: contact.initials, avatar: contact.avatarUrl || undefined, amount: contact.balanceAmount, direction: contact.balanceType === "TO_PAY" ? "pay" : "receive" };
}

export function usePeople() {
  const [people, setPeople] = useState<Person[]>([]);
  const [ready, setReady] = useState(false);
  const refresh = useCallback(async () => { try { setPeople((await api.people()).map(toPerson)); } finally { setReady(true); } }, []);
  useEffect(() => { void refresh(); }, [refresh]);

  return { people, setPeople, ready, refresh };
}
