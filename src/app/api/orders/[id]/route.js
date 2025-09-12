const order = await prisma.order.findUnique({
  where: { id: Number(params.id) },
  include: { items: true, shipping: true, payment: true },
});
