// otel.mjs — ESM-safe, no Resource constructor needed

import sdkNodePkg from '@opentelemetry/sdk-node';
const { NodeSDK } = sdkNodePkg;

import traceHttpPkg from '@opentelemetry/exporter-trace-otlp-http';
const { OTLPTraceExporter } = traceHttpPkg;

import metricsHttpPkg from '@opentelemetry/exporter-metrics-otlp-http';
const { OTLPMetricExporter } = metricsHttpPkg;

import sdkMetricsPkg from '@opentelemetry/sdk-metrics';
const { PeriodicExportingMetricReader } = sdkMetricsPkg;

import autoInstrPkg from '@opentelemetry/auto-instrumentations-node';
const { getNodeAutoInstrumentations } = autoInstrPkg;

// Optional: Prisma instrumentation if you're using Prisma
let PrismaInstrumentation;
try {
  ({ PrismaInstrumentation } = await import('@prisma/instrumentation'));
} catch { /* ignore if not installed */ }

const sdk = new NodeSDK({
  // No 'resource' field here; we’ll use env vars:
  //   OTEL_SERVICE_NAME=next-app
  //   OTEL_RESOURCE_ATTRIBUTES=deployment.environment=production
  traceExporter: new OTLPTraceExporter(),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter(),
  }),
  instrumentations: [
    getNodeAutoInstrumentations(),
    ...(PrismaInstrumentation ? [new PrismaInstrumentation()] : []),
  ],
});

await sdk.start();
process.on('SIGTERM', async () => { await sdk.shutdown(); process.exit(0); });
