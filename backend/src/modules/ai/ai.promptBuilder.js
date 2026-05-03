export const buildPrompt = ({ monitor, logs, incident }) => {
  const recentLogs = logs.slice(-5).map(log => {
    return `Status: ${log.status}, Latency: ${log.responseTime}ms, Success: ${log.success}`;
  }).join("\n");

  return `
You are an uptime monitoring AI.

Analyze the following data:

URL: ${monitor.url}
Method: ${monitor.method}

Recent Logs:
${recentLogs}

Incident:
${incident ? incident.message : "No active incident"}

Tasks:
1. Identify if system is stable or unstable
2. Possible root cause
3. Suggest fixes

Respond in JSON format:
{
  "status": "...",
  "reason": "...",
  "suggestion": "..."
}
`;
};