import {
  configureWunderGraphApplication,
  cors,
  EnvironmentVariable,
  introspect,
  templates,
} from "@wundergraph/sdk";
import server from "./wundergraph.server";
import operations from "./wundergraph.operations";

const spacex = introspect.graphql({
  apiNamespace: "spacex",
  url: 'https://spacex-api.fly.dev/graphql',
});

const faunaDB = introspect.graphql({
  apiNamespace: 'faunaDB',
  url: "https://graphql.eu.fauna.com/graphql",
  // url: new EnvironmentVariable('FAUNADB_GRAPHQL_URL'),
  headers: builder => {
    builder.addStaticHeader(
      'Authorization',
      // "Bearer fnAE4ciN2hAA1gvPF_kV8bzIoYDiTmff3RPejDh8"
      // "Bearer fnAE6xgAcTAA18qYvRrzc_pSKN3KgYl5rCx6qEQ0"
      new EnvironmentVariable('FAUNADB_TOKEN')
    );
    return builder;
  },
});

// configureWunderGraph emits the configuration
configureWunderGraphApplication({
  apis: [faunaDB, spacex],
  server,
  operations,
  codeGenerators: [
    {
      templates: [
        ...templates.typescript.all,
      ],
    },
  ],
  cors: {
      ...cors.allowAll,
      allowedOrigins:
      process.env.NODE_ENV === "production"
      ? [
          'https://reifenextrakt-storefront.vercel.app',
          // change this before deploying to production to the actual domain where you're deploying your app
          // "http://localhost:3000",
      ]
      : [
          "http://localhost:3000",
          new EnvironmentVariable("WG_ALLOWED_ORIGIN"),
      ],
  },
  dotGraphQLConfig: {
    hasDotWunderGraphDirectory: false,
  },
});
