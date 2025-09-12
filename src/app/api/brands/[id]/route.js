const brand = await prisma.brand.findUnique({ where: { id: Number(params.id) } });
