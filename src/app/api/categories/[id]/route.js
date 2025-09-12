const category = await prisma.category.findUnique({ where: { id: Number(params.id) } });
