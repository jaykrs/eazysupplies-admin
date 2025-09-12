const product = await prisma.product.findUnique({
  where: { id: Number(params.id) },
  include: { category: true, brand: true, tags: { include: { tag: true } } },
});
