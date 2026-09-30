import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api, type PageProps } from "../api";
import { Btn, PageHeader, Panel, Skeleton, useAction } from "../ui";
import { Field, Input } from "@/components/ui/field";

export default function SettingsPage({ useMeta }: PageProps) {
  useMeta("Settings · Admin | Donjo");
  const settings = useQuery(api.analytics.getSettings) as { retentionDays: number } | undefined;
  const setRetention = useMutation(api.analytics.setRetentionDays);
  const run = useAction();
  const [days, setDays] = useState("");
  useEffect(() => { if (settings) setDays(String(settings.retentionDays)); }, [settings]);
  const n = Number(days);
  const valid = Number.isInteger(n) && n >= 7 && n <= 730;
  return (
    <>
      <PageHeader title="Settings" />
      <Panel title="Analytics retention" description="Raw analytics events older than this are deleted automatically every few hours.">
        {!settings ? <Skeleton className="h-20 max-w-xs" /> : (
          <div className="flex max-w-md flex-wrap items-end gap-3">
            <div className="w-40"><Field label="Days to keep" helper="7 to 730" error={days && !valid ? "Enter 7 to 730" : undefined}>{(p) => <Input {...p} type="number" inputMode="numeric" min={7} max={730} value={days} onChange={(e) => setDays(e.target.value)} />}</Field></div>
            <Btn variant="primary" className="mb-6" disabled={!valid || n === settings.retentionDays} onClick={() => run(() => setRetention({ days: n }), "Retention updated")}>Save</Btn>
          </div>
        )}
      </Panel>
      <Panel title="Session" className="mt-6" description="For safety, you are signed out after 30 minutes without activity. Sign-ins and idle sign-outs are recorded in the audit log." >
        <p className="text-sm text-muted-foreground">Analytics never record IP addresses or personal data, skip the admin console, and honour Do Not Track.</p>
      </Panel>
    </>
  );
}
