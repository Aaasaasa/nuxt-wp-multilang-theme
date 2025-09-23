import { defineEventHandler } from "h3";
import { getPrisma } from "~/utils/dbClients";

export default defineEventHandler(async (event) => {
  const prisma = getPrisma();
  const id = Number(event.context.params!.id);

  await prisma.page.delete({ where: { id } });
  return { success: true };
});
