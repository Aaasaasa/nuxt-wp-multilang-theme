import { defineEventHandler } from "h3";
import { getPrisma } from "~/utils/dbClients";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const prisma = getPrisma();

  return prisma.page.create({
    data: {
      slug: body.slug,
      title: body.title,
      content: body.content,
      seoTitle: body.seoTitle,
      seoDescription: body.seoDescription,
      seoKeywords: body.seoKeywords,
      ogImage: body.ogImage,
      canonicalUrl: body.canonicalUrl,
      noIndex: body.noIndex ?? false,
    },
  });
});

/*

import { pg } from "../../utils/dbClients";

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params!.id);
  await pg.page.delete({ where: { id } });
  return { success: true };
});

*/
