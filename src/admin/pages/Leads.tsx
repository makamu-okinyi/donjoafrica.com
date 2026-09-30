import { useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { Download, MessageCircle, Search } from "lucide-react";
import { api, type PageProps } from "../api";
import { Badge, Btn, Dialog, EmptyState, PageHeader, Panel, Skeleton, downloadCsv, fmtDate, useAction } from "../ui";
import { Field, Input, Textarea } from "@/components/ui/field";
import { Select } from "@/components/ui/select";

type Status = "new" | "contacted" | "qualified" | "won" | "lost";
interface Lead { _id: string; name: string; email: string; brief: string; status: Status; assignee?: string; notes: { at: number; by: string; text: string }[]; createdAt: number }
const STATUSES: Status[] = ["new", "contacted", "qualified", "won", "lost"];
const tone = (s: Status) => (s === "won" ? "good" : s === "lost" ? "bad" : s === "new" ? "brand" : "neutral");

export default function Leads({ useMeta }: PageProps) {
  useMeta("Leads · Admin | Donjo");
  const leads = useQuery(api.consultations.list) as Lead[] | undefined;
  const setStatus = useMutation(api.consultations.setStatus);
  const assign = useMutation(api.consultations.assign);
  const addNote = useMutation(api.consultations.addNote);
  const run = useAction();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [assignee, setAssignee] = useState("");

  const rows = useMemo(() => (leads ?? []).filter((l) => (filter === "all" || l.status === filter) && (`${l.name} ${l.email} ${l.brief}`.toLowerCase().includes(q.toLowerCase()))), [leads, q, filter]);
  const open = leads?.find((l) => l._id === openId);

  return (
    <>
      <PageHeader
        title="Leads"
        description="Requests from the contact form."
        actions={<Btn disabled={!rows.length} onClick={() => downloadCsv("leads", ["Received", "Name", "Email", "Status", "Assignee", "Message"], rows.map((l) => [fmtDate(l.createdAt), l.name, l.email, l.status, l.assignee, l.brief]))}><Download className="h-4 w-4" aria-hidden="true" />Export CSV</Btn>}
      />
      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative min-w-[14rem] flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input aria-label="Search leads" placeholder="Search name, email or message" value={q} onChange={(e) => setQ(e.target.value)} className="pl-10" />
        </div>
        <div className="w-full sm:w-52">
          <Select id="lead-filter" aria-describedby={undefined} value={filter} onChange={setFilter} options={[{ value: "all", label: "All statuses" }, ...STATUSES.map((s) => ({ value: s, label: s[0].toUpperCase() + s.slice(1) }))]} />
        </div>
      </div>
      <Panel className="!p-0 overflow-hidden">
        {!leads ? (
          <div className="space-y-2 p-5">{Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-12" />)}</div>
        ) : rows.length === 0 ? (
          <EmptyState title={leads.length ? "No leads match your filters" : "No leads yet"}>{leads.length ? "Clear the search or filter." : "Contact-form requests will appear here."}</EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[40rem] text-left text-sm">
              <thead className="bg-foreground/5 text-xs uppercase tracking-wider text-muted-foreground"><tr><th className="px-5 py-3 font-semibold">Received</th><th className="px-5 py-3 font-semibold">Contact</th><th className="px-5 py-3 font-semibold">Message</th><th className="px-5 py-3 font-semibold">Status</th></tr></thead>
              <tbody>
                {rows.map((l) => (
                  <tr key={l._id} className="cursor-pointer border-t border-foreground/10 hover:bg-white/60" onClick={() => { setOpenId(l._id); setAssignee(l.assignee ?? ""); setNote(""); }}>
                    <td className="whitespace-nowrap px-5 py-3 text-muted-foreground">{fmtDate(l.createdAt)}</td>
                    <td className="px-5 py-3"><button type="button" className="text-left font-semibold text-foreground underline-offset-4 hover:underline" onClick={(e) => { e.stopPropagation(); setOpenId(l._id); setAssignee(l.assignee ?? ""); setNote(""); }}>{l.name}</button><br /><span className="text-muted-foreground">{l.email}</span></td>
                    <td className="max-w-xs truncate px-5 py-3 text-muted-foreground">{l.brief}</td>
                    <td className="px-5 py-3"><Badge tone={tone(l.status)}>{l.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      <Dialog open={!!open} onClose={() => setOpenId(null)} title={open ? open.name : "Lead"} wide>
        {open && (
          <div className="space-y-5">
            <p className="text-sm text-muted-foreground">{open.email} · received {fmtDate(open.createdAt)}</p>
            <p className="whitespace-pre-wrap rounded-xl bg-foreground/5 p-4 text-sm text-foreground">{open.brief}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Status">
                {(p) => <Select {...p} value={open.status} onChange={(v) => run(() => setStatus({ id: open._id, status: v as Status }), "Status updated")} options={STATUSES.map((s) => ({ value: s, label: s[0].toUpperCase() + s.slice(1) }))} />}
              </Field>
              <Field label="Assignee" optional>
                {(p) => <Input {...p} value={assignee} maxLength={80} onChange={(e) => setAssignee(e.target.value)} onBlur={() => assignee !== (open.assignee ?? "") && run(() => assign({ id: open._id, assignee }), "Assignee saved")} />}
              </Field>
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold">Notes</p>
              {open.notes.length === 0 && <p className="text-sm text-muted-foreground">No notes yet.</p>}
              <ul className="space-y-2">{open.notes.map((n) => <li key={n.at} className="rounded-xl bg-foreground/5 p-3 text-sm"><span className="text-xs text-muted-foreground">{n.by} · {fmtDate(n.at)}</span><br />{n.text}</li>)}</ul>
              <div className="mt-3"><Field label="Add a note">{(p) => <Textarea {...p} rows={2} maxLength={1000} value={note} onChange={(e) => setNote(e.target.value)} />}</Field></div>
              <div className="mt-2 flex flex-wrap justify-between gap-2">
                <a className="inline-flex h-10 items-center gap-2 rounded-xl border border-[hsl(var(--field-border))] bg-white/60 px-4 text-sm font-semibold hover:bg-white" target="_blank" rel="noopener noreferrer" href={`https://wa.me/?text=${encodeURIComponent(`Hi ${open.name}, thanks for contacting Donjo. `)}`}><MessageCircle className="h-4 w-4" aria-hidden="true" />Reply on WhatsApp</a>
                <Btn variant="primary" disabled={!note.trim()} onClick={async () => { await run(() => addNote({ id: open._id, text: note }), "Note added"); setNote(""); }}>Add note</Btn>
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </>
  );
}
