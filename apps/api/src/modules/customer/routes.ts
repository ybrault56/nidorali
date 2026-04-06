import type { FastifyInstance } from "fastify";

import { success } from "../../shared/response.js";
import { customerLoginSchema, customerRegisterSchema } from "./schema.js";
import { listCustomerOrders, loginCustomerAccount, registerCustomerAccount } from "./service.js";

/**
 * Enregistre les routes du portail client Nidorali.
 *
 * @param fastify - Instance Fastify
 */
export async function registerCustomerRoutes(fastify: FastifyInstance) {
  fastify.post("/customer/register", async (request, reply) => {
    const body = customerRegisterSchema.parse(request.body);
    const result = await registerCustomerAccount(fastify, body);
    return reply.status(201).send(success(result));
  });

  fastify.post("/customer/login", async (request, reply) => {
    const body = customerLoginSchema.parse(request.body);
    const result = await loginCustomerAccount(fastify, body);
    return reply.send(success(result));
  });

  fastify.get("/customer/orders", { preHandler: [fastify.authenticateCustomer] }, async (request, reply) => {
    const result = await listCustomerOrders(fastify, request.customerUser!.accountId);
    return reply.send(success(result));
  });
}
