import { createServer } from "node:http";
import { createPubSub, createSchema, createYoga } from "graphql-yoga";
import { typeDefs } from "./graphql/typeDefs.js";
import { resolvers } from "./graphql/resolvers.js";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { APP_SECRET } from './src/constants.js';
import { authenticateUser } from "./src/auth.js";
//import {YogaInitialContext } from './types.js';

const pubSub = createPubSub();
const yoga = createYoga({
  schema: createSchema({
    typeDefs,
    resolvers,
  }),
  // to run websocket
  graphiql: {
    subscriptionsProtocol: "WS",
  },

  context: (initialContext) => ({
    pubSub, // to notify listener of change through resolvers
    APP_SECRET,
    currentUser: authenticateUser(initialContext.request),
  })
});



const server = createServer(yoga);
// initialize the server
const wsServer = new WebSocketServer({
  server,
  path: yoga.graphqlEndpoint,
});

useServer(
  {
    execute: (args) => args.rootValue.execute(args),
    subscribe: (args) => args.rootValue.subscribe(args),
    onConnect: () => console.log("Client connected"),
    onDisconnect: () => console.log("Client disconnected"),
    onSubscribe: async (ctx, msg) => {
      const { schema, execute, subscribe, contextFactory, parse, validate } =
        yoga.getEnveloped({
          ...ctx,
          req: ctx.extra.request,
          socket: ctx.extra.socket,
          params: msg.payload,
        });

      const args = {
        schema,
        operationName: msg.payload.operationName,
        document: parse(msg.payload.query),
        variableValues: msg.payload.variables,
        contextValue: await contextFactory(),
        rootValue: {
          execute,
          subscribe,
        },
      };

      const errors = validate(args.schema, args.document);
      if (errors.length) return errors;
      return args;
    },
  },
  wsServer
);

server.listen(4000, (req, res) => {
  console.log("Running a GraphQL API server at http://localhost:4000/graphql");
});
