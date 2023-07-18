import express from "express";
import { ApolloServer, gql } from "apollo-server-express";
import {
  createConnection,
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from "typeorm";
import "reflect-metadata";
import dotenv from "dotenv";

dotenv.config();

// Product entity
@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar" })
  name!: string;

  @Column("float")
  price!: number;
}

// Define your GraphQL schema
const typeDefs = gql`
  type Product {
    id: ID!
    name: String!
    price: Float!
  }

  type Query {
    products: [Product!]!
  }
`;

// Implement your GraphQL resolvers
const resolvers = {
  Query: {
    products: async () => {
      try {
        const products = await Product.find();
        return products;
      } catch (error) {
        console.log("Error fetching products:", error);
        throw error; // or return an error message
      }
    },
  }
};

async function startApolloServer() {
  const server = new ApolloServer({ typeDefs, resolvers });

  await server.start();

  const app = express();
  server.applyMiddleware({ app });

  await createConnection({
    type: "postgres",
    host: "postgres",
    port: parseInt(process.env.DB_PORT || "5432", 10),
    username: "postgres",
    password: "mysecretpassword",
    database: "didingraphql",
    synchronize: true,
    logging: true,
    entities: [Product],
  });

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

(async () => {
  try {
    await startApolloServer();
  } catch (error) {
    console.log("Error starting ApolloServer:", error);
  }
})();
