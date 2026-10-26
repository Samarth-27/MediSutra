import React, { useState, useMemo } from 'react';
import { Zap, Server, ShieldCheck, RefreshCw } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export const LoadSimulatorView: React.FC = () => {
  const [concurrency, setConcurrency] = useState<number>(25000); // 10k to 50k req/sec
  const [pgBouncerEnabled, setPgBouncerEnabled] = useState<boolean>(true);
  const [redisL2Enabled, setRedisL2Enabled] = useState<boolean>(true);
  const [circuitBreakerEnabled, setCircuitBreakerEnabled] = useState<boolean>(true);

  // Dynamic simulation calculations
  const metrics = useMemo(() => {
    const loadFactor = concurrency / 10000; // 1.0 to 5.0

    // Without PgBouncer, connections exhaust rapidly
    const maxDbConnections = 100;
    const directConnectionsNeeded = Math.round(concurrency * 0.015);
    const poolConnections = pgBouncerEnabled ? Math.min(48, Math.round(15 + loadFactor * 5)) : Math.min(250, directConnectionsNeeded);
    const poolSaturationPercent = pgBouncerEnabled 
      ? Math.round((poolConnections / 60) * 100) 
      : Math.min(100, Math.round((poolConnections / maxDbConnections) * 100));

    // Calculate Latency (ms)
    let p50 = 12;
    let p95 = 28;
    let p99 = 45;

    // Cache degradation if Redis OFF
    if (!redisL2Enabled) {
      p50 += loadFactor * 14;
      p95 += loadFactor * 42;
      p99 += loadFactor * 95;
    } else {
      p50 += loadFactor * 2;
      p95 += loadFactor * 6;
      p99 += loadFactor * 12;
    }

    // Connection pooling degradation if PgBouncer OFF
    if (!pgBouncerEnabled) {
      p50 += loadFactor * 35;
      p95 += loadFactor * 160;
      p99 += loadFactor * 420;
    }

    // Circuit breaker shedding load if ON vs exploding if OFF under overload
    if (concurrency > 35000 && !circuitBreakerEnabled && !pgBouncerEnabled) {
      p99 += 1850; // Main-thread event loop freeze
    }

    // Event Loop Lag (ms)
    const eventLoopLag = pgBouncerEnabled && redisL2Enabled ? Math.round(2 + loadFactor * 0.8) : Math.round(18 + loadFactor * 24);

    return {
      p50: Math.round(p50),
      p95: Math.round(p95),
      p99: Math.round(p99),
      poolSaturationPercent,
      eventLoopLag,
      throughputRps: Math.round(concurrency * (circuitBreakerEnabled ? 0.998 : 0.82)),
      errorRatePercent: !pgBouncerEnabled && concurrency > 30000 ? (concurrency > 40000 ? 14.8 : 6.2) : 0.01
    };
  }, [concurrency, pgBouncerEnabled, redisL2Enabled, circuitBreakerEnabled]);

  // Synthetic 24-Hour OPD Load Curve Data for Recharts
  const chartData = useMemo(() => {
    const hours = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];
    const multipliers = [0.4, 0.9, 1.0, 0.75, 0.95, 0.6, 0.3];

    return hours.map((hour, idx) => {
      const currentConcurrency = Math.round(concurrency * multipliers[idx]);
      const factor = currentConcurrency / 10000;

      let p50Val = 10 + (redisL2Enabled ? 2 : 12) * factor;
      let p95Val = 25 + (pgBouncerEnabled ? 6 : 90) * factor;
      let p99Val = 40 + (pgBouncerEnabled && redisL2Enabled ? 15 : 280) * factor;

      return {
        time: hour,
        p50: Math.round(p50Val),
        p95: Math.round(p95Val),
        p99: Math.round(p99Val)
      };
    });
  }, [concurrency, pgBouncerEnabled, redisL2Enabled, circuitBreakerEnabled]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Simulation Controls Card */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        padding: '24px',
        border: '1.5px solid #CBD5E1',
        boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-teal">PEAK OPD STRESS LAB</span>
              <span style={{ fontSize: '0.8rem', color: '#64748B' }}>10,000 – 50,000 Concurrent HTTP Requests / Sec</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>
              Nationwide Multi-Hospital Load Simulator
            </h3>
          </div>

          <button
            type="button"
            onClick={() => {
              setPgBouncerEnabled(true);
              setRedisL2Enabled(true);
              setCircuitBreakerEnabled(true);
              setConcurrency(25000);
            }}
            style={{
              background: '#F1F5F9',
              border: '1px solid #CBD5E1',
              color: '#334155',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RefreshCw size={14} /> Reset Recommended Defaults
          </button>
        </div>

        {/* Concurrency Slider */}
        <div style={{ marginBottom: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <label style={{ fontSize: '0.88rem', fontWeight: 700, color: '#334155' }}>
              Simulated Hospital OPD Ingestion Load:
            </label>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0D9488', fontFamily: 'monospace' }}>
              {concurrency.toLocaleString()} req / sec
            </span>
          </div>
          <input
            type="range"
            min="10000"
            max="50000"
            step="2500"
            value={concurrency}
            onChange={(e) => setConcurrency(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#0D9488', height: '6px', cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#64748B', marginTop: '4px' }}>
            <span>10,000 req/s (Standard Morning OPD)</span>
            <span>25,000 req/s (Peak AIIMS / Apollo Surge)</span>
            <span>50,000 req/s (Nationwide Epidemic Triage)</span>
          </div>
        </div>

        {/* Architectural Toggles */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
          {/* Toggle 1: PgBouncer */}
          <div style={{
            border: `1.5px solid ${pgBouncerEnabled ? '#0D9488' : '#CBD5E1'}`,
            background: pgBouncerEnabled ? '#F0FDFA' : '#F8FAFC',
            borderRadius: '12px',
            padding: '14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Server size={18} color={pgBouncerEnabled ? '#0D9488' : '#64748B'} />
                <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A' }}>PgBouncer Multiplexing</span>
              </div>
              <p style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '2px' }}>
                Transaction pooling mode (re-uses 50 persistent server conns)
              </p>
            </div>
            <button
              type="button"
              onClick={() => setPgBouncerEnabled(!pgBouncerEnabled)}
              style={{
                background: pgBouncerEnabled ? '#0D9488' : '#94A3B8',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '20px',
                padding: '5px 12px',
                fontSize: '0.74rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              {pgBouncerEnabled ? 'ACTIVE' : 'OFF (DIRECT)'}
            </button>
          </div>

          {/* Toggle 2: Redis L2 Cache */}
          <div style={{
            border: `1.5px solid ${redisL2Enabled ? '#0284C7' : '#CBD5E1'}`,
            background: redisL2Enabled ? '#F0F9FF' : '#F8FAFC',
            borderRadius: '12px',
            padding: '14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={18} color={redisL2Enabled ? '#0284C7' : '#64748B'} />
                <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A' }}>Redis L2 Cache Layer</span>
              </div>
              <p style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '2px' }}>
                Sub-millisecond dossier & biometric cache invalidation
              </p>
            </div>
            <button
              type="button"
              onClick={() => setRedisL2Enabled(!redisL2Enabled)}
              style={{
                background: redisL2Enabled ? '#0284C7' : '#94A3B8',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '20px',
                padding: '5px 12px',
                fontSize: '0.74rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              {redisL2Enabled ? 'ACTIVE' : 'OFF'}
            </button>
          </div>

          {/* Toggle 3: Circuit Breakers */}
          <div style={{
            border: `1.5px solid ${circuitBreakerEnabled ? '#16A34A' : '#CBD5E1'}`,
            background: circuitBreakerEnabled ? '#F0FDF4' : '#F8FAFC',
            borderRadius: '12px',
            padding: '14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={18} color={circuitBreakerEnabled ? '#16A34A' : '#64748B'} />
                <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A' }}>Queue Backpressure</span>
              </div>
              <p style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '2px' }}>
                BullMQ async worker throttling & 202 status shedding
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCircuitBreakerEnabled(!circuitBreakerEnabled)}
              style={{
                background: circuitBreakerEnabled ? '#16A34A' : '#94A3B8',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '20px',
                padding: '5px 12px',
                fontSize: '0.74rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              {circuitBreakerEnabled ? 'ACTIVE' : 'OFF'}
            </button>
          </div>
        </div>
      </div>

      {/* Live Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div className="card" style={{ padding: '16px', background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748B' }}>p50 LATENCY (MEDIAN)</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0D9488', marginTop: '4px' }}>
            {metrics.p50} ms
          </div>
          <div style={{ fontSize: '0.72rem', color: '#16A34A', fontWeight: 600, marginTop: '2px' }}>
            Target: &lt; 20 ms
          </div>
        </div>

        <div className="card" style={{ padding: '16px', background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748B' }}>p95 LATENCY</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0284C7', marginTop: '4px' }}>
            {metrics.p95} ms
          </div>
          <div style={{ fontSize: '0.72rem', color: '#0369A1', fontWeight: 600, marginTop: '2px' }}>
            Target: &lt; 80 ms
          </div>
        </div>

        <div className="card" style={{ padding: '16px', background: '#FFFFFF', border: metrics.p99 > 500 ? '1.5px solid #EF4444' : '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: metrics.p99 > 500 ? '#DC2626' : '#64748B' }}>
            p99 LATENCY (TAIL RISK)
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: metrics.p99 > 500 ? '#DC2626' : '#F59E0B', marginTop: '4px' }}>
            {metrics.p99} ms
          </div>
          <div style={{ fontSize: '0.72rem', color: metrics.p99 > 500 ? '#DC2626' : '#D97706', fontWeight: 600, marginTop: '2px' }}>
            {metrics.p99 > 500 ? '⚠️ High Tail Latency Risk' : 'Acceptable Under Load'}
          </div>
        </div>

        <div className="card" style={{ padding: '16px', background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748B' }}>PG POOL SATURATION</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: metrics.poolSaturationPercent > 85 ? '#DC2626' : '#0F172A', marginTop: '4px' }}>
            {metrics.poolSaturationPercent}%
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '2px' }}>
            {pgBouncerEnabled ? 'Max 50 Server Sockets' : 'Direct RDS Conn Exhaustion'}
          </div>
        </div>

        <div className="card" style={{ padding: '16px', background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748B' }}>EVENT LOOP LAG</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: metrics.eventLoopLag > 20 ? '#DC2626' : '#16A34A', marginTop: '4px' }}>
            {metrics.eventLoopLag} ms
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '2px' }}>
            Node.js Single-Thread State
          </div>
        </div>
      </div>

      {/* Latency Curve Visualization (Recharts) */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        padding: '22px',
        border: '1.5px solid #CBD5E1',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>
              Simulated 24-Hour OPD Latency Curves (p50 / p95 / p99)
            </h4>
            <p style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>
              Demonstrates zero-downtime stability with PgBouncer + Redis vs. synchronous event-loop thrashing.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '14px', fontSize: '0.76rem', fontWeight: 700 }}>
            <span style={{ color: '#0D9488' }}>● p50 Median</span>
            <span style={{ color: '#0284C7' }}>● p95 Service</span>
            <span style={{ color: '#F59E0B' }}>● p99 Tail Latency</span>
          </div>
        </div>

        <div style={{ height: '280px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="p50Grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0D9488" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#0D9488" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="p95Grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284C7" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#0284C7" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="p99Grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="time" stroke="#94A3B8" fontSize={12} />
              <YAxis unit="ms" stroke="#94A3B8" fontSize={12} />
              <Tooltip />
              <Area type="monotone" dataKey="p99" stroke="#F59E0B" fillOpacity={1} fill="url(#p99Grad)" />
              <Area type="monotone" dataKey="p95" stroke="#0284C7" fillOpacity={1} fill="url(#p95Grad)" />
              <Area type="monotone" dataKey="p50" stroke="#0D9488" fillOpacity={1} fill="url(#p50Grad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
