import {
  Activity,
  AlertTriangle,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  Gauge,
  Lightbulb,
  RefreshCcw,
  TrendingUp,
} from 'lucide-react';
import UplotLineChart from '../../../components/charts/UplotLineChart';
import { formatInterval } from '../dashboardUtils';

const getHealthStyle = (analytics) => {
  if (!analytics || analytics.totalChecks === 0) {
    return {
      badge: 'border-slate-300 bg-slate-100 text-slate-600',
      dot: 'bg-slate-300',
      label: 'NO LOGS',
    };
  }

  if (analytics.status === 'DOWN' || analytics.failures > 0) {
    return {
      badge: 'border-red-300 bg-red-50 text-red-700',
      dot: 'bg-red-500',
      label: analytics.status,
    };
  }

  return {
    badge: 'border-emerald-300 bg-emerald-50 text-emerald-700',
    dot: 'bg-[#00E676]',
    label: analytics.status,
  };
};

const MetricTile = ({ label, value, tone = 'bg-[#FDFBF7]' }) => (
  <div className={`rounded-xl border-2 border-black px-4 py-3 ${tone}`}>
    <p className="text-[11px] font-black uppercase tracking-[0.08em] text-slate-500">{label}</p>
    <p className="mt-1 text-base font-black text-slate-950">{value}</p>
  </div>
);

const formatDateTime = (value) => {
  if (!value) return '-';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';

  return date.toLocaleString([], {
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
  });
};

const DonutChart = ({ failures, success, total }) => {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const failureRate = total ? failures / total : 0;
  const successRate = total ? success / total : 0;
  const failureDash = failureRate * circumference;
  const successDash = successRate * circumference;

  return (
    <div className="relative mx-auto h-36 w-36">
      <svg viewBox="0 0 120 120" role="img" aria-label="Success and failure donut chart" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="#E5E7EB" strokeWidth="18" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#00E676"
          strokeDasharray={`${successDash} ${circumference - successDash}`}
          strokeLinecap="round"
          strokeWidth="18"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#FF3B30"
          strokeDasharray={`${failureDash} ${circumference - failureDash}`}
          strokeDashoffset={-successDash}
          strokeLinecap="round"
          strokeWidth="18"
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="text-2xl font-black text-slate-950">{total ? Math.round(failureRate * 100) : 0}%</p>
          <p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">fail</p>
        </div>
      </div>
    </div>
  );
};

const LatencyBarChart = ({ trend }) => {
  const points = trend?.slice(-10) || [];
  const maxLatency = Math.max(...points.map((point) => point.latency), 1);

  if (points.length === 0) {
    return (
      <div className="grid h-44 place-items-center rounded-xl border-2 border-dashed border-slate-300 bg-white text-xs font-black uppercase tracking-[0.12em] text-slate-400">
        No latency bars
      </div>
    );
  }

  return (
    <div className="rounded-xl border-2 border-black bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-black uppercase tracking-[0.08em] text-slate-600">Latency bars</p>
        <p className="text-xs font-black uppercase tracking-[0.08em] text-slate-500">{maxLatency}ms max</p>
      </div>
      <div className="grid h-40 grid-flow-col items-end gap-2">
        {points.map((point, index) => {
          const height = Math.max(8, Math.round((point.latency / maxLatency) * 100));
          const isSlow = point.latency >= maxLatency * 0.7;

          return (
            <div key={`${point.time}-${index}`} className="grid h-full min-w-0 grid-rows-[minmax(0,1fr)_18px] gap-2">
              <div className="flex min-h-0 items-end rounded-lg border-2 border-black bg-[#FDFBF7] p-1">
                <div
                  className={`w-full rounded-md border border-black ${isSlow ? 'bg-[#FF3B30]' : 'bg-[#1E6BFF]'}`}
                  title={`${point.time}: ${point.latency}ms`}
                  style={{ height: `${height}%` }}
                />
              </div>
              <span className="truncate text-center text-[9px] font-black text-slate-400">{point.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TrendChart = ({ trend }) => {
  const points = trend?.slice(-12) || [];
  const maxLatency = Math.max(...points.map((point) => point.latency), 1);

  if (points.length === 0) {
    return (
      <div className="grid min-h-[180px] place-items-center rounded-xl border-2 border-dashed border-slate-300 bg-[#FDFBF7] text-xs font-black uppercase tracking-[0.12em] text-slate-400">
        No trend logs
      </div>
    );
  }

  const chartPoints = points.map((point) => ({
    label: point.time,
    value: point.latency,
  }));

  return (
    <div className="rounded-xl border-2 border-black bg-[#FDFBF7] p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl border-2 border-black bg-[#BFE8FF]">
            <TrendingUp size={18} strokeWidth={3} />
          </span>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.08em] text-slate-600">Latency trend</p>
            <p className="text-sm font-black text-slate-950">{points.length} check buckets tracked</p>
          </div>
        </div>
        <span className="rounded-full border-2 border-black bg-white px-2.5 py-1 text-[10px] font-black uppercase text-slate-600">
          {maxLatency}ms peak
        </span>
      </div>
      <UplotLineChart ariaLabel="Latency trend chart" color="#E11D48" height={164} points={chartPoints} valueSuffix="ms" />
      <div className="mt-3 flex items-center justify-between gap-2 text-xs font-black uppercase tracking-[0.08em] text-slate-500">
        <span>{points[0]?.time}</span>
        <span>latest checks</span>
        <span>{points.at(-1)?.time}</span>
      </div>
    </div>
  );
};

const ReliabilityPanel = ({ analytics }) => {
  const total = analytics?.totalChecks || 0;
  const success = analytics?.success || 0;
  const failures = analytics?.failures || 0;
  const failureRate = total ? Math.round((failures / total) * 100) : 0;
  const successRate = total ? 100 - failureRate : 0;

  return (
    <div className="grid gap-4 rounded-xl border-2 border-black bg-[#FDFBF7] p-4">
      <div className="flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-xl border-2 border-black bg-[#FFD600]">
          <Gauge size={18} strokeWidth={3} />
        </span>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.08em] text-slate-600">Reliability pie</p>
          <p className="text-sm font-black text-slate-950">{total ? `${failureRate}% failing` : 'No checks yet'}</p>
        </div>
      </div>

      <DonutChart failures={failures} success={success} total={total} />

      <div className="grid grid-cols-2 gap-2">
        <MetricTile label="Passed" value={success} tone="bg-emerald-50" />
        <MetricTile label="Failed" value={failures} tone="bg-red-50" />
      </div>

      <div className="overflow-hidden rounded-xl border-2 border-black bg-white">
        <div className="flex h-8 w-full">
          <div className="bg-[#00E676]" style={{ width: `${successRate}%` }} />
          <div className="bg-[#FF3B30]" style={{ width: `${failureRate}%` }} />
          {!total && <div className="w-full bg-slate-100" />}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs font-black uppercase tracking-[0.08em] text-slate-600">
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full border border-black bg-[#00E676]" />
          Success
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full border border-black bg-[#FF3B30]" />
          Failure
        </div>
      </div>
    </div>
  );
};

const StatusDistributionChart = ({ monitors, analyticsByMonitorId }) => {
  const buckets = monitors.reduce((counts, monitor) => {
    const analytics = analyticsByMonitorId[monitor.id];

    if (!analytics || analytics.totalChecks === 0) {
      counts.noLogs += 1;
    } else if (analytics.status === 'DOWN' || analytics.failures > 0) {
      counts.down += 1;
    } else {
      counts.up += 1;
    }

    return counts;
  }, { down: 0, noLogs: 0, up: 0 });
  const total = Math.max(monitors.length, 1);
  const rows = [
    { color: 'bg-[#00E676]', label: 'UP', value: buckets.up },
    { color: 'bg-[#FF3B30]', label: 'DOWN', value: buckets.down },
    { color: 'bg-slate-300', label: 'NO LOGS', value: buckets.noLogs },
  ];

  return (
    <div className="rounded-2xl border-[3px] border-black bg-white p-5 shadow-[6px_6px_0_#0F172A]">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-xl border-2 border-black bg-[#BFE8FF]">
            <BarChart3 size={19} strokeWidth={3} />
          </span>
          <div>
            <h3 className="text-sm font-black text-slate-950">Monitor distribution</h3>
            <p className="text-sm font-medium leading-6 text-slate-500">Status split across active monitor records.</p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        {rows.map((row) => (
          <div key={row.label} className="grid grid-cols-[72px_minmax(0,1fr)_36px] items-center gap-3">
            <span className="text-xs font-black uppercase tracking-[0.08em] text-slate-600">{row.label}</span>
            <div className="h-7 overflow-hidden rounded-lg border-2 border-black bg-[#FDFBF7]">
              <div className={`h-full ${row.color}`} style={{ width: `${Math.max(row.value ? 8 : 0, (row.value / total) * 100)}%` }} />
            </div>
            <span className="text-right text-sm font-black text-slate-950">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const AIInsightPanel = ({ insight, incident }) => {
  if (!insight && !incident) {
    return (
      <div className="rounded-xl border-2 border-dashed border-slate-300 bg-[#FDFBF7] p-4">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.08em] text-slate-600">
          <BrainCircuit size={16} strokeWidth={3} />
          AI summary
        </div>
        <p className="mt-3 text-sm font-bold leading-6 text-slate-500">
          No backend AI incident has been generated for this monitor yet.
        </p>
      </div>
    );
  }

  const suggestions = Array.isArray(insight?.suggestion)
    ? insight.suggestion
    : insight?.suggestion
      ? [insight.suggestion]
      : [];

  return (
    <div className="rounded-xl border-2 border-black bg-[#FDFBF7] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl border-2 border-black bg-[#BFE8FF] text-black">
            <BrainCircuit size={18} strokeWidth={3} />
          </span>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.08em] text-slate-600">AI incident summary</p>
            <p className="text-sm font-black uppercase text-slate-950">{insight?.status || incident?.status || 'Pending'}</p>
          </div>
        </div>
        <span className="rounded-full border-2 border-black bg-white px-2.5 py-1 text-xs font-black uppercase text-slate-600">
          {formatDateTime(insight?.createdAt || incident?.createdAt || incident?.startedAt)}
        </span>
      </div>

      {incident && (
        <div className="mt-3 flex items-start gap-2 rounded-lg border-2 border-black bg-white p-2">
          <Clock3 className="mt-0.5 shrink-0 text-[#1E6BFF]" size={16} strokeWidth={3} />
          <p className="text-sm font-bold leading-6 text-slate-600">
            {incident.message || 'Incident opened by backend failure processor'} with {incident.failCount ?? 0} failed checks.
          </p>
        </div>
      )}

      <p className="mt-4 max-w-3xl text-sm font-bold leading-6 text-slate-700">
        {insight?.reason || 'AI analysis is waiting for enough failure context.'}
      </p>

      {suggestions.length > 0 && (
        <div className="mt-3 grid gap-2">
          {suggestions.slice(0, 3).map((suggestion) => (
            <div key={suggestion} className="flex items-start gap-2 rounded-lg border-2 border-black bg-[#FFD600] p-2">
              <Lightbulb className="mt-0.5 shrink-0 text-black" size={16} strokeWidth={3} />
              <p className="text-sm font-black leading-6 text-black">{suggestion}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const IncidentsSection = ({
  aiInsightsByMonitorId,
  analyticsByMonitorId,
  analyticsError,
  incidentDetailsError,
  incidentsByMonitorId,
  isLoadingAnalytics,
  monitors,
  onRefresh,
}) => {
  const openIssueCount = monitors.filter((monitor) => {
    const analytics = analyticsByMonitorId[monitor.id];
    return analytics?.status === 'DOWN' || analytics?.failures > 0;
  }).length;
  const checkedCount = monitors.filter((monitor) => analyticsByMonitorId[monitor.id]?.totalChecks > 0).length;
  const aiInsightCount = Object.values(aiInsightsByMonitorId).reduce((count, insights) => count + (insights?.length || 0), 0);

  return (
    <section className="grid min-w-0 gap-5">
      <div className="rounded-2xl border-[3px] border-black bg-white p-5 shadow-[6px_6px_0_#0F172A]">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <div>
            <h2 className="text-xl font-black text-slate-950">Incident signal</h2>
            <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-600">
              Live incident health from backend monitor checks, log analytics, incident records, and AI summaries.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onRefresh}
              disabled={isLoadingAnalytics || monitors.length === 0}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border-[3px] border-black bg-[#FFD600] px-4 text-sm font-black text-black shadow-[3px_3px_0_#0F172A] hover:bg-[#00E676] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCcw className={isLoadingAnalytics ? 'animate-spin' : ''} size={17} strokeWidth={3} />
              Refresh logs
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricTile label="Monitors" value={monitors.length} />
          <MetricTile label="With logs" value={checkedCount} />
          <MetricTile label="Needs attention" value={openIssueCount} />
          <MetricTile label="AI summaries" value={aiInsightCount} />
        </div>

        {(analyticsError || incidentDetailsError) && (
          <div className="mt-4 rounded-xl border-[3px] border-black bg-red-50 p-3 text-sm font-black text-red-700">
            {analyticsError || incidentDetailsError}
          </div>
        )}
      </div>

      <StatusDistributionChart analyticsByMonitorId={analyticsByMonitorId} monitors={monitors} />

      {monitors.length === 0 ? (
        <div className="rounded-2xl border-[3px] border-dashed border-slate-300 bg-white p-8 text-center shadow-[6px_6px_0_#0F172A]">
          <p className="text-lg font-black text-slate-950">No monitors yet</p>
          <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
            Create a monitor first, then log analytics can appear here after checks run.
          </p>
        </div>
      ) : (
        <div className="grid min-w-0 gap-5 2xl:grid-cols-2">
          {monitors.map((monitor) => {
            const analytics = analyticsByMonitorId[monitor.id];
            const latestIncident = incidentsByMonitorId[monitor.id]?.[0];
            const latestInsight = aiInsightsByMonitorId[monitor.id]?.[0];
            const health = getHealthStyle(analytics);

            return (
              <article key={monitor.id} className="min-w-0 rounded-2xl border-[3px] border-black bg-white p-5 shadow-[6px_6px_0_#0F172A]">
                <div className="flex min-w-0 items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className={`h-3 w-3 shrink-0 rounded-full border-2 border-black ${health.dot}`} />
                      <h3 className="truncate text-lg font-black text-slate-950">{monitor.name}</h3>
                    </div>
                    <p className="mt-2 break-all text-sm font-bold leading-6 text-slate-600">{monitor.method} {monitor.url}</p>
                    <p className="mt-1 text-xs font-black uppercase tracking-[0.08em] text-slate-500">Every {formatInterval(monitor.interval)}</p>
                  </div>
                  <span className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-black uppercase ${health.badge}`}>
                    {isLoadingAnalytics && !analytics ? 'LOADING' : health.label}
                  </span>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <MetricTile label="Checks" value={analytics?.totalChecks ?? '-'} />
                  <MetricTile label="Success" value={analytics?.success ?? '-'} />
                  <MetricTile label="Failures" value={analytics?.failures ?? '-'} />
                  <MetricTile label="Avg latency" value={analytics ? `${analytics.avgLatency}ms` : '-'} />
                </div>

                <div className="mt-6 border-t-2 border-slate-200 pt-5">
                  <div className="mb-3 flex items-center gap-2">
                    <BarChart3 size={18} strokeWidth={3} className="text-[#1E6BFF]" />
                    <h4 className="text-sm font-black uppercase tracking-[0.08em] text-slate-700">Log analytics</h4>
                  </div>
                </div>

                <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_300px] 2xl:items-stretch">
                  <TrendChart trend={analytics?.trend} />
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2 rounded-xl border-2 border-black bg-[#FDFBF7] px-3 py-2">
                      <CheckCircle2 size={17} strokeWidth={3} className="text-emerald-700" />
                      <span className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">Uptime</span>
                      <span className="ml-auto text-sm font-black text-slate-950">{analytics ? `${analytics.uptime}%` : '-'}</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl border-2 border-black bg-[#FDFBF7] px-3 py-2">
                      <AlertTriangle size={17} strokeWidth={3} className="text-amber-700" />
                      <span className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">Latest</span>
                      <span className="ml-auto text-sm font-black text-slate-950">{analytics?.status || '-'}</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl border-2 border-black bg-[#FDFBF7] px-3 py-2">
                      <BarChart3 size={17} strokeWidth={3} className="text-[#1E6BFF]" />
                      <span className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">Trend</span>
                      <span className="ml-auto text-sm font-black text-slate-950">{analytics?.trend?.length || 0}</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl border-2 border-black bg-[#FDFBF7] px-3 py-2">
                      <Activity size={17} strokeWidth={3} className="text-red-600" />
                      <span className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">Signal</span>
                      <span className="ml-auto text-sm font-black text-slate-950">
                        {analytics?.failures ? 'Noisy' : 'Calm'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
                  <ReliabilityPanel analytics={analytics} />
                  <LatencyBarChart trend={analytics?.trend} />
                </div>

                <div className="mt-6 border-t-2 border-slate-200 pt-5">
                  <div className="mb-3 flex items-center gap-2">
                    <BrainCircuit size={18} strokeWidth={3} className="text-[#1E6BFF]" />
                    <h4 className="text-sm font-black uppercase tracking-[0.08em] text-slate-700">AI incident context</h4>
                  </div>
                  <AIInsightPanel insight={latestInsight} incident={latestIncident} />
                </div>
              </article>
            );
          })}
        </div>
      )}

      {isLoadingAnalytics && (
        <div className="fixed bottom-24 right-4 z-30 inline-flex items-center gap-2 rounded-xl border-[3px] border-black bg-white px-4 py-3 text-sm font-black text-slate-950 shadow-[4px_4px_0_#0F172A] lg:bottom-4">
          <Activity size={17} strokeWidth={3} className="text-[#1E6BFF]" />
          Loading log analytics
        </div>
      )}
    </section>
  );
};

export default IncidentsSection;
