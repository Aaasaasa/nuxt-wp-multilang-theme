import { defineEventHandler } from "h3";
import { getPrisma } from "~/utils/dbClients";

export default defineEventHandler(async (event) => {
  const prisma = getPrisma();
  const id = Number(event.context.params!.id);

  return prisma.page.findUnique({ where: { id } });
});
