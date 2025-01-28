/*import GraphQLServer from "./server";
import schema from "./schema";

const graphQLServer = new GraphQLServer(schema);

graphQLServer.listen((port: number) => console.log(`http://localhost:${port}/graphql`));
*/
import { makeExecutableSchema } from "@graphql-tools/schema";
import { GraphQLSchema } from "graphql";
import { ApolloServer, gql } from "apollo-server-express";
import compression from "compression";
import express from "express";
import { createServer } from "http";



async function start() {
    const app = express();

    app.use(compression());

    //definir los tipos de difinicion



    const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

    type Query {
        hello: String!
        helloWithName(name: String): String!
        peopleNumber: Int!
    }
`;

    //resolvers


    // Resolvers define the technique for fetching the types defined in the
    // schema. This resolver retrieves books from the "books" array above.
    const resolvers = {
        Query: {
            hello: (): string => "hola a la api ",
            helloWithName: (_: void, args: { name: string }, context: any, info: object) => {
                console.log(info);
                return `Hola ${args.name}`
            },
            peopleNumber: () => 189303
        },
    };


    //construir el schema ejecutable


    const schema: GraphQLSchema = makeExecutableSchema({
        typeDefs,
        resolvers
    });

    const apolloServer = new ApolloServer({
        schema,
        introspection: true
    });


    await apolloServer.start();

    apolloServer.applyMiddleware({app, cors: true})



    
    app.use("/hello", (_, res) => {
        res.send("bienvenidos");
    });

    app.get("/", (_, res) => {
        res.redirect("/graphql");
    });

    const httpServer = createServer(app);

    httpServer.listen({
        port: 3025
    },
        () => console.log("servidor => http://localhost:3025"));
}

start();




