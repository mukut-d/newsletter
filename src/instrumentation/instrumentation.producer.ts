import {NodeSDK} from '@opentelemetry/sdk-node'
import {PeriodicExportingMetricReader, ConsoleMetricExporter} from  '@opentelemetry/sdk-metrics'
import {ConsoleSpanExporter} from '@opentelemetry/sdk-trace-node'
import {PgInstrumentation} from '@opentelemetry/instrumentation-pg'
import {ExpressInstrumentation} from '@opentelemetry/instrumentation-express'
import {HttpInstrumentation} from '@opentelemetry/instrumentation-http'
import {IORedisInstrumentation} from '@opentelemetry/instrumentation-ioredis'
import {OTLPMetricExporter} from "@opentelemetry/exporter-metrics-otlp-proto"
import {OTLPTraceExporter} from "@opentelemetry/exporter-trace-otlp-proto"


const sdk = new NodeSDK({
    serviceName: 'producer',
    traceExporter: new OTLPTraceExporter({
        url: 'http://127.0.0.1:4318/v1/traces'
    }),
    metricReader: new PeriodicExportingMetricReader({
        exporter: new OTLPMetricExporter({
            url: 'http://127.0.0.1:4318/v1/metrics'
        })
    }),
    instrumentations: [
        new ExpressInstrumentation(),
        new HttpInstrumentation(),
        new PgInstrumentation(),
        new IORedisInstrumentation()
    ]

})

sdk.start();