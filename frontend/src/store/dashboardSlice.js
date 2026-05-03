import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAIInsights, getDashboardSummary, getIncidentTimeline } from '../services/dashboardApi';
import { getMonitorAnalytics } from '../services/logApi';
import {
  createMonitor,
  deleteMonitor,
  getMonitors,
  updateMonitor,
} from '../services/monitorApi';

export const fetchMonitors = createAsyncThunk('dashboard/fetchMonitors', getMonitors);

export const fetchDashboardSummary = createAsyncThunk('dashboard/fetchDashboardSummary', getDashboardSummary);

export const fetchAnalytics = createAsyncThunk(
  'dashboard/fetchAnalytics',
  async (_, { getState }) => {
    const { monitors } = getState().dashboard;

    if (monitors.length === 0) {
      return {};
    }

    const entries = await Promise.all(
      monitors.map(async (monitor) => {
        const analytics = await getMonitorAnalytics(monitor.id);
        return [monitor.id, analytics];
      }),
    );

    return Object.fromEntries(entries);
  },
);

export const fetchIncidentDetails = createAsyncThunk(
  'dashboard/fetchIncidentDetails',
  async (_, { getState }) => {
    const { monitors } = getState().dashboard;

    if (monitors.length === 0) {
      return {
        aiInsightsByMonitorId: {},
        incidentsByMonitorId: {},
      };
    }

    const entries = await Promise.all(
      monitors.map(async (monitor) => {
        const [incidents, aiInsights] = await Promise.all([
          getIncidentTimeline(monitor.id),
          getAIInsights(monitor.id),
        ]);

        return [monitor.id, { incidents, aiInsights }];
      }),
    );

    return entries.reduce((data, [monitorId, details]) => {
      data.incidentsByMonitorId[monitorId] = Array.isArray(details.incidents) ? details.incidents : [];
      data.aiInsightsByMonitorId[monitorId] = Array.isArray(details.aiInsights) ? details.aiInsights : [];
      return data;
    }, {
      aiInsightsByMonitorId: {},
      incidentsByMonitorId: {},
    });
  },
);

export const createMonitorRecord = createAsyncThunk('dashboard/createMonitor', createMonitor);

export const updateMonitorRecord = createAsyncThunk(
  'dashboard/updateMonitor',
  async ({ id, data }) => updateMonitor(id, data),
);

export const deleteMonitorRecord = createAsyncThunk(
  'dashboard/deleteMonitor',
  async (id) => {
    await deleteMonitor(id);
    return id;
  },
);

export const toggleMonitorRecord = createAsyncThunk(
  'dashboard/toggleMonitor',
  async (monitor) => updateMonitor(monitor.id, {
    url: monitor.url,
    method: monitor.method,
    interval: monitor.interval,
    active: !monitor.active,
  }),
);

const initialState = {
  aiInsightsByMonitorId: {},
  analyticsByMonitorId: {},
  analyticsError: '',
  dashboardSummary: null,
  dashboardSummaryError: '',
  deletingMonitorId: null,
  incidentDetailsError: '',
  incidentsByMonitorId: {},
  isLoadingAnalytics: false,
  isLoadingDashboardSummary: false,
  isLoadingIncidentDetails: false,
  isLoadingMonitors: true,
  isSavingMonitor: false,
  monitorError: '',
  monitors: [],
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearMonitorError(state) {
      state.monitorError = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMonitors.pending, (state) => {
        state.isLoadingMonitors = true;
        state.monitorError = '';
      })
      .addCase(fetchMonitors.fulfilled, (state, action) => {
        state.isLoadingMonitors = false;
        state.monitors = action.payload;
      })
      .addCase(fetchMonitors.rejected, (state, action) => {
        state.isLoadingMonitors = false;
        state.monitorError = action.error.message || 'Unable to load monitors';
      })
      .addCase(fetchAnalytics.pending, (state) => {
        state.isLoadingAnalytics = true;
        state.analyticsError = '';
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.isLoadingAnalytics = false;
        state.analyticsByMonitorId = action.payload;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.isLoadingAnalytics = false;
        state.analyticsError = action.error.message || 'Unable to load log analytics';
      })
      .addCase(fetchIncidentDetails.pending, (state) => {
        state.isLoadingIncidentDetails = true;
        state.incidentDetailsError = '';
      })
      .addCase(fetchIncidentDetails.fulfilled, (state, action) => {
        state.isLoadingIncidentDetails = false;
        state.aiInsightsByMonitorId = action.payload.aiInsightsByMonitorId;
        state.incidentsByMonitorId = action.payload.incidentsByMonitorId;
      })
      .addCase(fetchIncidentDetails.rejected, (state, action) => {
        state.isLoadingIncidentDetails = false;
        state.incidentDetailsError = action.error.message || 'Unable to load AI incident details';
      })
      .addCase(fetchDashboardSummary.pending, (state) => {
        state.isLoadingDashboardSummary = true;
        state.dashboardSummaryError = '';
      })
      .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
        state.isLoadingDashboardSummary = false;
        state.dashboardSummary = action.payload;
      })
      .addCase(fetchDashboardSummary.rejected, (state, action) => {
        state.isLoadingDashboardSummary = false;
        state.dashboardSummaryError = action.error.message || 'Unable to load dashboard summary';
      })
      .addCase(createMonitorRecord.pending, (state) => {
        state.isSavingMonitor = true;
        state.monitorError = '';
      })
      .addCase(createMonitorRecord.fulfilled, (state, action) => {
        state.isSavingMonitor = false;
        state.monitors.unshift(action.payload);
      })
      .addCase(createMonitorRecord.rejected, (state, action) => {
        state.isSavingMonitor = false;
        state.monitorError = action.error.message || 'Unable to create monitor';
      })
      .addCase(updateMonitorRecord.pending, (state) => {
        state.isSavingMonitor = true;
        state.monitorError = '';
      })
      .addCase(updateMonitorRecord.fulfilled, (state, action) => {
        state.isSavingMonitor = false;
        state.monitors = state.monitors.map((monitor) => (
          monitor.id === action.payload.id ? action.payload : monitor
        ));
      })
      .addCase(updateMonitorRecord.rejected, (state, action) => {
        state.isSavingMonitor = false;
        state.monitorError = action.error.message || 'Unable to update monitor';
      })
      .addCase(toggleMonitorRecord.pending, (state) => {
        state.isSavingMonitor = true;
        state.monitorError = '';
      })
      .addCase(toggleMonitorRecord.fulfilled, (state, action) => {
        state.isSavingMonitor = false;
        state.monitors = state.monitors.map((monitor) => (
          monitor.id === action.payload.id ? action.payload : monitor
        ));
      })
      .addCase(toggleMonitorRecord.rejected, (state, action) => {
        state.isSavingMonitor = false;
        state.monitorError = action.error.message || 'Unable to update monitor';
      })
      .addCase(deleteMonitorRecord.pending, (state, action) => {
        state.deletingMonitorId = action.meta.arg;
        state.monitorError = '';
      })
      .addCase(deleteMonitorRecord.fulfilled, (state, action) => {
        state.deletingMonitorId = null;
        state.monitors = state.monitors.filter((monitor) => monitor.id !== action.payload);
      })
      .addCase(deleteMonitorRecord.rejected, (state, action) => {
        state.deletingMonitorId = null;
        state.monitorError = action.error.message || 'Unable to delete monitor';
      });
  },
});

export const { clearMonitorError } = dashboardSlice.actions;

export default dashboardSlice.reducer;
