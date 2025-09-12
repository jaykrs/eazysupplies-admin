const role = await prisma.role.findUnique({ where: { id: Number(params.id) } });
