const payment = await prisma.payment.findUnique({ where: { id: Number(params.id) } });
