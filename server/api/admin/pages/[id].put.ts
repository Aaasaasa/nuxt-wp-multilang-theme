import { defineEventHandler } from 'h3';
import { getPrisma } from "../../../utils/dbClients";

export default defineEventHandler(async (event) => {
  const prisma = getPrisma();
  const id = Number(event.context.params!.id);
  const body = await readBody(event);

  return prisma.page.update({
    where: { id },
    data: {
      slug: body.slug,
      title: body.title,
      content: body.content,
      seoTitle: body.seoTitle,
      seoDescription: body.seoDescription,
      seoKeywords: body.seoKeywords,
      ogImage: body.ogImage,
      canonicalUrl: body.canonicalUrl,
      noIndex: body.noIndex ?? false
    }
  });
});
