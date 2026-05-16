import { useMemo, useState } from 'react';
import { BellRing, RefreshCcw } from 'lucide-react';

const normalizeAlerts = (payload) => {
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.alerts)) return payload.alerts;
  return [];
};

const AlertsSection = ({ alertsPayload, isLoading, error, monitors, onRefresh }) => {
  const [query, setQuery] = useState('');

  const alerts = useMemo(() => normalizeAlerts(alertsPayload), [alertsPayload]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return alerts;
    return alerts.filter((a) =>
      `${a.type || ''} ${a.message || ''} ${a.monitorId || ''}`.toLowerCase().includes(q),
    );
  }, [alerts, query]);

  const monitorNameById = useMemo(() => {
    const map = new Map();
    monitors.forEach((m) => map.set(m.id, m.name));
    return map;
  }, [monitors]);

  return (
    <section className="grid min-w-0 gap-5">
      <div className="rounded-2xl border-[3px] border-black bg-white p-5 shadow-[6px_6px_0_#0F172A]">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <div>
            <h2 className="text-xl font-black text-slate-950">Alerts</h2>
            <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-600">
              Backend alert history emitted by monitor checks and incident pipelines.
            </p>
          </div>
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border-[3px] border-black bg-[#FFD600] px-4 text-sm font-black text-black shadow-[3px_3px_0_#0F172A] hover:bg-[#00E676] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCcw className={isLoading ? 'animate-spin' : ''} size={17} strokeWidth={3} />
            Refresh
          </button>
        </div>

        <div className="mt-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search alerts"
            className="h-11 w-full rounded-xl border-[3px] border-black bg-[#FDFBF7] px-3 text-sm font-bold outline-none placeholder:text-slate-400 focus:bg-white"
          />
        </div>

        {error && (
          <div className="mt-4 rounded-xl border-[3px] border-black bg-red-50 p-3 text-sm font-black text-red-700">
            {error}
          </div>
        )}
      </div>

      <div className="rounded-2xl border-[3px] border-black bg-white p-5 shadow-[6px_6px_0_#0F172A]">
        {filtered.length === 0 ? (
          <div className="grid place-items-center rounded-xl border-2 border-dashed border-slate-300 bg-[#FDFBF7] p-8 text-center">
            <BellRing size={22} strokeWidth={3} className="text-slate-400" />
            <p className="mt-3 text-sm font-black uppercase tracking-[0.12em] text-slate-500">
              No alerts yet
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {filtered.slice(0, 60).map((a, idx) => (
              <div
                key={a?._id || a?.id || `${a?.monitorId}-${idx}`}
                className="rounded-xl border-2 border-black bg-[#FDFBF7] p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-black text-slate-950">{a.message || a.title || 'Alert'}</p>
                    <p className="mt-1 text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                      monitor: {monitorNameById.get(a.monitorId) || a.monitorId || '-'} · type: {a.type || '-'}
                    </p>
                  </div>
                  <span className="rounded-full border-2 border-black bg-white px-3 py-1 text-[10px] font-black uppercase text-slate-600">
                    {a.createdAt ? new Date(a.createdAt).toLocaleString() : '-'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AlertsSection;

