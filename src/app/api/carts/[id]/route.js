const cart = await prisma.cart.findUnique({
  where: { id: Number(params.id) },
  include: { items: true },
});
