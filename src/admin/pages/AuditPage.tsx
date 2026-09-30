import { useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { Download, Search } from "lucide-react";
import { api, type PageProps } from "../api";
import { Btn, EmptyState, PageHeader, Panel, Skeleton, downloadCsv, fmtDate } from "../ui";
import { Input } from "@/components/ui/field";

interface Entry { _id: string; email?: string; action: string; detail?: string; at: number; userAgent?: string }

export default function AuditPage({ useMeta }: PageProps) {
  useMeta("Audit log · Admin | Donjo");
  const log = useQuery(api.admin.auditLog, { limit: 500 }) as Entry[] | undefined;
  const [q, setQ] = useState("");
  const rows = useMemo(() => (log ?? []).filter((e) => `${e.email ?? ""} ${e.action} ${e.detail ?? ""}`.toLowerCase().includes(q.toLowerCase())), [log, q]);
  return (
    <>
      <PageHeader title="Audit log" description="Sign-ins and every change made in this console. Entries cannot be edited." actions={<Btn disabled={!rows.length} onClick={() => downloadCsv("audit-log", ["When", "Admin", "Action", "Detail"], rows.map((e) => [fmtDate(e.at), e.email ?? "system", e.action, e.detail]))}><Download className="h-4 w-4" aria-hidden="true" />Export CSV</Btn>} />
      <div className="relative mb-4 max-w-md">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <Input aria-label="Filter the audit log" placeholder="Filter by admin, action or detail" value={q} onChange={(e) => setQ(e.target.value)} className="pl-10" />
      </div>
      <Panel className="!p-0 overflow-hidden">
        {!log ? <div className="space-y-2 p-5">{Array.from({ length: 5 }, (_, i) => <Skeleton key={i} className="h-10" />)}</div> : rows.length === 0 ? <EmptyState title="Nothing to show" /> : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[40rem] text-left text-sm">
              <thead className="bg-foreground/5 text-xs uppercase tracking-wider text-muted-foreground"><tr><th className="px-5 py-3 font-semibold">When</th><th className="px-5 py-3 font-semibold">Admin</th><th className="px-5 py-3 font-semibold">Action</th><th className="px-5 py-3 font-semibold">Detail</th></tr></thead>
              <tbody>{rows.map((e) => <tr key={e._id} className="border-t border-foreground/10"><td className="whitespace-nowrap px-5 py-2.5 text-muted-foreground">{fmtDate(e.at)}</td><td className="px-5 py-2.5">{e.email ?? "system"}</td><td className="px-5 py-2.5 font-mono text-xs">{e.action}</td><td className="max-w-xs truncate px-5 py-2.5 text-muted-foreground">{e.detail}</td></tr>)}</tbody>
            </table>
          </div>
        )}
      </Panel>
    </>
  );
}
