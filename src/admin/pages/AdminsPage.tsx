import { useState } from "react";
import { useAction as useConvexAction, useMutation, useQuery } from "convex/react";
import { startRegistration } from "@simplewebauthn/browser";
import { Fingerprint, Plus, Trash2 } from "lucide-react";
import { api, type PageProps } from "../api";
import { Badge, Btn, Confirm, Dialog, PageHeader, Panel, Skeleton, fmtDate, useAction } from "../ui";
import { Field, Input } from "@/components/ui/field";

interface AdminRow { id: string; email: string; name: string | null; active: boolean; createdAt: number; createdBy: string | null; activated: boolean; passkeys: number }
interface Passkey { id: string; deviceLabel: string; createdAt: number; lastUsedAt: number | null }

export default function AdminsPage({ useMeta }: PageProps) {
  useMeta("Admin users · Admin | Donjo");
  const admins = useQuery(api.admin.listAdmins) as AdminRow[] | undefined;
  const mine = useQuery(api.passkeys.listMine) as Passkey[] | undefined;
  const invite = useMutation(api.admin.inviteAdmin);
  const setActive = useMutation(api.admin.setAdminActive);
  const removePasskey = useMutation(api.passkeys.remove);
  const regOptions = useConvexAction(api.passkeysNode.registrationOptions);
  const verifyReg = useConvexAction(api.passkeysNode.verifyRegistration);
  const run = useAction();
  const [inviting, setInviting] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [drop, setDrop] = useState<Passkey | null>(null);
  const [busy, setBusy] = useState(false);

  const addPasskey = async () => {
    setBusy(true);
    await run(async () => {
      const options = await regOptions({});
      const response = await startRegistration({ optionsJSON: options });
      const res = (await verifyReg({ response, deviceLabel: navigator.platform || "This device" })) as { ok: boolean; error?: string };
      if (!res.ok) throw new Error(res.error ?? "Could not add the passkey");
    }, "Passkey added");
    setBusy(false);
  };

  return (
    <>
      <PageHeader title="Admin users" description="Only people on this list can sign in. There is no public sign-up." actions={<Btn variant="primary" onClick={() => setInviting(true)}><Plus className="h-4 w-4" aria-hidden="true" />Invite admin</Btn>} />
      <Panel title="Admins" className="mb-6">
        {!admins ? <Skeleton className="h-24" /> : (
          <ul className="divide-y divide-foreground/10">
            {admins.map((a) => (
              <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 py-3.5">
                <div className="min-w-0"><p className="font-semibold text-foreground">{a.name || a.email}</p><p className="text-sm text-muted-foreground">{a.email} · added {fmtDate(a.createdAt)}{a.createdBy ? ` by ${a.createdBy}` : ""}</p></div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={a.active ? "good" : "neutral"}>{a.active ? "Active" : "Deactivated"}</Badge>
                  <Badge>{a.activated ? "Activated" : "Invited"}</Badge>
                  <Badge>{a.passkeys} passkey{a.passkeys === 1 ? "" : "s"}</Badge>
                  <Btn onClick={() => run(() => setActive({ id: a.id, active: !a.active }), a.active ? "Admin deactivated" : "Admin activated")}>{a.active ? "Deactivate" : "Activate"}</Btn>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>
      <Panel title="Your passkeys" description="Sign in with your fingerprint, face or a security key. Your biometrics stay on your device; Donjo stores only a public key." action={<Btn variant="primary" disabled={busy} onClick={addPasskey}><Fingerprint className="h-4 w-4" aria-hidden="true" />{busy ? "Waiting for your device" : "Add a passkey"}</Btn>}>
        {!mine ? <Skeleton className="h-16" /> : mine.length === 0 ? <p className="text-sm text-muted-foreground">No passkeys yet.</p> : (
          <ul className="divide-y divide-foreground/10">
            {mine.map((p) => <li key={p.id} className="flex items-center justify-between gap-3 py-3"><span><strong>{p.deviceLabel}</strong><br /><span className="text-sm text-muted-foreground">Added {fmtDate(p.createdAt)}{p.lastUsedAt ? ` · last used ${fmtDate(p.lastUsedAt)}` : ""}</span></span><Btn aria-label={`Remove ${p.deviceLabel}`} variant="ghost" className="!w-10 !px-0 text-red-800" onClick={() => setDrop(p)}><Trash2 className="h-4 w-4" /></Btn></li>)}
          </ul>
        )}
      </Panel>

      <Dialog open={inviting} onClose={() => setInviting(false)} title="Invite an admin">
        <div className="space-y-4">
          <Field label="Email" required helper="They activate their account at /admin/login with this email.">{(p) => <Input {...p} type="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} />}</Field>
          <Field label="Name" optional>{(p) => <Input {...p} maxLength={80} value={name} onChange={(e) => setName(e.target.value)} />}</Field>
          <div className="flex justify-end gap-2"><Btn onClick={() => setInviting(false)}>Cancel</Btn><Btn variant="primary" disabled={!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)} onClick={async () => { await run(() => invite({ email, name: name || undefined }), "Admin invited"); setInviting(false); setEmail(""); setName(""); }}>Send invite</Btn></div>
        </div>
      </Dialog>
      <Confirm open={!!drop} title="Remove passkey?" body={`${drop?.deviceLabel ?? "This passkey"} will no longer sign you in.`} confirmLabel="Remove" danger onConfirm={() => drop && run(() => removePasskey({ passkeyId: drop.id }), "Passkey removed")} onClose={() => setDrop(null)} />
    </>
  );
}
