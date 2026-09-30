import { useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { ArrowDown, ArrowUp, Eye, EyeOff, ImagePlus, Pencil, Plus, Trash2 } from "lucide-react";
import { api, type PageProps } from "../api";
import { Badge, Btn, Confirm, Dialog, EmptyState, PageHeader, Panel, Skeleton, fmtDate, useAction } from "../ui";
import { Field, Input, Textarea } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import { PARTNER_SECTORS } from "@/components/PartnerRequestForm";

interface Req { _id: string; organisation: string; contactName: string; email: string; phone?: string; sector: string; website?: string; message: string; status: "new" | "approved" | "declined"; createdAt: number; declineNote?: string; partnerId?: string }
interface Partner { _id: string; name: string; sector: string; blurb: string; website?: string; isPublished: boolean; order: number; logoPreview: string | null }

const MAX_LOGO = 1_000_000;
const LOGO_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];

export default function PartnersPage({ useMeta }: PageProps) {
  useMeta("Partners · Admin | Donjo");
  const requests = useQuery(api.partners.adminListRequests) as Req[] | undefined;
  const partners = useQuery(api.partners.adminList) as Partner[] | undefined;
  const approve = useMutation(api.partners.adminApproveRequest);
  const decline = useMutation(api.partners.adminDeclineRequest);
  const create = useMutation(api.partners.adminCreate);
  const update = useMutation(api.partners.adminUpdate);
  const setPub = useMutation(api.partners.adminSetPublished);
  const move = useMutation(api.partners.adminMove);
  const del = useMutation(api.partners.adminDelete);
  const uploadUrl = useMutation(api.admin.generateUploadUrl);
  const setLogo = useMutation(api.partners.adminSetLogo);
  const removeLogo = useMutation(api.partners.adminRemoveLogo);
  const run = useAction();

  const [edit, setEdit] = useState<Partial<Partner> | null>(null);
  const [declining, setDeclining] = useState<Req | null>(null);
  const [declineNote, setDeclineNote] = useState("");
  const [deleting, setDeleting] = useState<Partner | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const [logoErr, setLogoErr] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const logoTarget = useRef<string | null>(null);

  const pending = (requests ?? []).filter((r) => r.status === "new");
  const history = (requests ?? []).filter((r) => r.status !== "new");

  const pickLogo = (id: string) => { logoTarget.current = id; setLogoErr(""); fileRef.current?.click(); };
  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    const id = logoTarget.current;
    if (!file || !id) return;
    if (!LOGO_TYPES.includes(file.type)) return setLogoErr("Use a PNG, JPEG, WebP or SVG image.");
    if (file.size > MAX_LOGO) return setLogoErr("Logo must be under 1 MB.");
    setUploading(id);
    await run(async () => {
      const url = await uploadUrl({});
      const res = await fetch(url, { method: "POST", headers: { "Content-Type": file.type }, body: file });
      if (!res.ok) throw new Error("Upload failed");
      const { storageId } = await res.json();
      await setLogo({ id, storageId });
    }, "Logo uploaded");
    setUploading(null);
  };

  const save = async () => {
    if (!edit) return;
    const body = { name: edit.name ?? "", sector: edit.sector ?? "", blurb: edit.blurb ?? "", website: edit.website || undefined, isPublished: !!edit.isPublished };
    const ok = await run(() => (edit._id ? update({ id: edit._id, ...body }) : create(body)), edit._id ? "Partner updated" : "Partner added");
    if (ok !== undefined || edit._id) setEdit(null);
  };

  return (
    <>
      <PageHeader title="Partners" description="Review partnership requests and manage the logo wall on the public site." actions={<Btn variant="primary" onClick={() => setEdit({ isPublished: false })}><Plus className="h-4 w-4" aria-hidden="true" />Add partner</Btn>} />
      <input ref={fileRef} type="file" accept={LOGO_TYPES.join(",")} className="sr-only" tabIndex={-1} aria-hidden="true" onChange={onFile} />
      {logoErr && <p role="alert" className="mb-4 rounded-xl bg-red-600/15 px-4 py-3 text-sm font-medium text-red-900">{logoErr}</p>}

      <Panel title={`Requests to review${pending.length ? ` (${pending.length})` : ""}`} className="mb-6">
        {!requests ? <Skeleton className="h-20" /> : pending.length === 0 ? <EmptyState title="No requests waiting">New partnership requests from the website appear here.</EmptyState> : (
          <ul className="space-y-3">
            {pending.map((r) => (
              <li key={r._id} className="rounded-xl border border-foreground/10 bg-white/60 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0"><p className="font-semibold text-foreground">{r.organisation} <span className="font-normal text-muted-foreground">· {r.sector}</span></p><p className="text-sm text-muted-foreground">{r.contactName} · {r.email}{r.phone ? ` · ${r.phone}` : ""}{r.website ? ` · ${r.website}` : ""}</p><p className="text-xs text-muted-foreground">{fmtDate(r.createdAt)}</p></div>
                  <div className="flex gap-2"><Btn variant="primary" onClick={() => run(() => approve({ requestId: r._id }), "Approved. Add a logo and publish when ready.")}>Approve</Btn><Btn onClick={() => { setDeclining(r); setDeclineNote(""); }}>Decline</Btn></div>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm text-foreground/80">{r.message}</p>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel title="Partners" description="Only published partners show on the site, in this order." className="mb-6">
        {!partners ? <Skeleton className="h-24" /> : partners.length === 0 ? <EmptyState title="No partners yet">Approve a request or add a partner. Until one is published, the site shows a "Become our first partner" prompt.</EmptyState> : (
          <ul className="divide-y divide-foreground/10">
            {partners.map((p, i) => (
              <li key={p._id} className="flex flex-wrap items-center gap-4 py-4">
                <div className="flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-foreground/10 bg-white">
                  {p.logoPreview ? <img src={p.logoPreview} alt={`${p.name} logo`} className="max-h-full max-w-full object-contain" /> : <span className="px-2 text-center text-xs text-muted-foreground">No logo</span>}
                </div>
                <div className="min-w-[10rem] flex-1"><p className="font-semibold text-foreground">{p.name}</p><p className="text-sm text-muted-foreground">{p.sector}</p></div>
                <Badge tone={p.isPublished ? "good" : "neutral"}>{p.isPublished ? "Published" : "Hidden"}</Badge>
                <div className="flex flex-wrap gap-1.5">
                  <Btn aria-label="Move up" disabled={i === 0} onClick={() => run(() => move({ id: p._id, direction: "up" }))} className="!w-10 !px-0"><ArrowUp className="h-4 w-4" /></Btn>
                  <Btn aria-label="Move down" disabled={i === partners.length - 1} onClick={() => run(() => move({ id: p._id, direction: "down" }))} className="!w-10 !px-0"><ArrowDown className="h-4 w-4" /></Btn>
                  <Btn onClick={() => pickLogo(p._id)} disabled={uploading === p._id}><ImagePlus className="h-4 w-4" aria-hidden="true" />{uploading === p._id ? "Uploading" : p.logoPreview ? "Replace logo" : "Upload logo"}</Btn>
                  {p.logoPreview && <Btn variant="ghost" onClick={() => run(() => removeLogo({ id: p._id }), "Logo removed")}>Remove logo</Btn>}
                  <Btn onClick={() => run(() => setPub({ id: p._id, isPublished: !p.isPublished }), p.isPublished ? "Hidden from the site" : "Published on the site")}>{p.isPublished ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}{p.isPublished ? "Hide" : "Publish"}</Btn>
                  <Btn aria-label={`Edit ${p.name}`} onClick={() => setEdit(p)} className="!w-10 !px-0"><Pencil className="h-4 w-4" /></Btn>
                  <Btn aria-label={`Delete ${p.name}`} variant="ghost" onClick={() => setDeleting(p)} className="!w-10 !px-0 text-red-800"><Trash2 className="h-4 w-4" /></Btn>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      {history.length > 0 && (
        <Panel title="Past requests">
          <ul className="divide-y divide-foreground/10 text-sm">
            {history.map((r) => <li key={r._id} className="flex flex-wrap items-center justify-between gap-2 py-2.5"><span><strong>{r.organisation}</strong> <span className="text-muted-foreground">· {r.email} · {fmtDate(r.createdAt)}</span></span><Badge tone={r.status === "approved" ? "good" : "bad"}>{r.status}</Badge></li>)}
          </ul>
        </Panel>
      )}

      <Dialog open={!!edit} onClose={() => setEdit(null)} title={edit?._id ? "Edit partner" : "Add partner"}>
        {edit && (
          <div className="space-y-4">
            <Field label="Name" required>{(p) => <Input {...p} maxLength={120} value={edit.name ?? ""} onChange={(e) => setEdit({ ...edit, name: e.target.value })} />}</Field>
            <Field label="Sector" required>{(p) => <Select {...p} value={edit.sector ?? ""} onChange={(v) => setEdit({ ...edit, sector: v })} options={PARTNER_SECTORS} />}</Field>
            <Field label="Short blurb" optional count={{ value: (edit.blurb ?? "").length, max: 240 }}>{(p) => <Textarea {...p} rows={3} maxLength={240} value={edit.blurb ?? ""} onChange={(e) => setEdit({ ...edit, blurb: e.target.value })} />}</Field>
            <Field label="Website" optional>{(p) => <Input {...p} inputMode="url" maxLength={200} value={edit.website ?? ""} onChange={(e) => setEdit({ ...edit, website: e.target.value })} />}</Field>
            <label className="flex items-center gap-3 text-sm font-medium"><input type="checkbox" className="h-5 w-5 accent-[hsl(var(--brand-strong))]" checked={!!edit.isPublished} onChange={(e) => setEdit({ ...edit, isPublished: e.target.checked })} />Show on the public site</label>
            <div className="flex justify-end gap-2 pt-2"><Btn onClick={() => setEdit(null)}>Cancel</Btn><Btn variant="primary" onClick={save}>Save</Btn></div>
          </div>
        )}
      </Dialog>

      <Dialog open={!!declining} onClose={() => setDeclining(null)} title={`Decline ${declining?.organisation ?? ""}`}>
        <Field label="Internal note" optional helper="Only admins see this.">{(p) => <Textarea {...p} rows={3} maxLength={500} value={declineNote} onChange={(e) => setDeclineNote(e.target.value)} />}</Field>
        <div className="mt-5 flex justify-end gap-2"><Btn onClick={() => setDeclining(null)}>Cancel</Btn><Btn variant="danger" onClick={async () => { if (declining) await run(() => decline({ requestId: declining._id, note: declineNote }), "Request declined"); setDeclining(null); }}>Decline request</Btn></div>
      </Dialog>

      <Confirm open={!!deleting} title="Delete partner?" body={`${deleting?.name ?? "This partner"} and its logo will be removed from the site. This can't be undone.`} confirmLabel="Delete" danger onConfirm={() => deleting && run(() => del({ id: deleting._id }), "Partner deleted")} onClose={() => setDeleting(null)} />
    </>
  );
}
