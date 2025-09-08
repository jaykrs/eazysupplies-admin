import { NextResponse } from "next/server";
import product from "./product.json";
import { parseAuthCookie, verifyJwt, verifyRole } from '../utils/jwt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// export async function GET(request) {
//   const searchParams = request?.nextUrl?.searchParams;
//   const queryCategory = searchParams.get("category");
//   const querySortBy = searchParams.get("sortBy");
//   const querySearch = searchParams.get("search");
//   const queryTag = searchParams.get("tag");
//   const queryIds = searchParams.get("ids");

//   const queryPage = parseInt(searchParams.get("page")) || 1; // default to page 1
//   const queryLimit = parseInt(searchParams.get("paginate")) || 10; // default to 10 items per page

//   let products = product?.data || [];

//   // Filtering logic
//   if (querySortBy || queryCategory || querySearch || queryTag || queryIds) {
//     // Filter by category
//     if (queryCategory) {
//       products = products.filter((post) => post?.categories?.some((category) => queryCategory.split(",").includes(category.slug)));
//     }

//     // Filter by tag
//     if (queryTag) {
//       products = products.filter((post) => post?.tags?.some((tag) => queryTag.split(",").includes(tag.slug)));
//     }

//     if (queryIds) {
//       products = products.filter((product) => queryIds.split(",").includes(product?.id?,()));
//     }

//     // Search filter by title
//     if (querySearch) {
//       products = products.filter((post) => post.title.toLowerCase().includes(querySearch.toLowerCase()));
//     }

//     // Sort logic
//     if (querySortBy === "asc") {
//       products = products.sort((a, b) => a.id - b.id);
//     } else if (querySortBy === "desc") {
//       products = products.sort((a, b) => b.id - a.id);
//     } else if (querySortBy === "a-z") {
//       products = products.sort((a, b) => a.title.localeCompare(b.title));
//     } else if (querySortBy === "z-a") {
//       products = products.sort((a, b) => b.title.localeCompare(a.title));
//     } else if (querySortBy === "newest") {
//       products = products.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
//     } else if (querySortBy === "oldest") {
//       products = products.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
//     }
//   }

//   products = products?.length ? products : product?.data;

//   // Implementing pagination
//   const totalproducts = products.length;
//   const startIndex = (queryPage - 1) * queryLimit;
//   const endIndex = startIndex + queryLimit;
//   const paginatedproducts = products.slice(startIndex, endIndex);

//   const response = {
//     current_page: queryPage,
//     last_page: Math.ceil(totalproducts / queryLimit),
//     total: totalproducts,
//     per_page: queryLimit,
//     data: paginatedproducts, // the products for the current page
//   };

//   return NextResponse.json(response);
// }


export async function GET(request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get('productid') && !searchParams.get('type')) {
    const numValue = Number(searchParams.get('productid'));
    const product = await prisma.product.findUnique({
      where: {
        id: numValue
      }
    })
    if (!product) {
      return NextResponse.json({ error: 'product  does not exist' }, { status: 404 });
    }
    return NextResponse.json({ message: 'product details', product });
  } else if (searchParams.get('tag') && !searchParams.get('productid')) {
    const tag = searchParams.get('tag');
    if (!tag) {
      return NextResponse.json({ error: 'Tag parameter is missing' }, { status: 400 });
    }
    const products = await prisma.product.findMany({
      where: {
        tag: {
          contains: tag,
        }
      }
    });
    if (!products || products.length === 0) {
      return NextResponse.json({ error: 'No products found with that tag' }, { status: 404 });
    }
    return NextResponse.json({ message: 'product details', products });
  } else if (searchParams.get('products') && searchParams.get('products') === "all") {
    const products = await prisma.product.findMany({});
    return NextResponse.json({ message: 'product list', products });
  }
  // Return a default response or error if no conditions are met
  return NextResponse.json({ error: 'Invalid request parameters' }, { status: 400 });
}

export async function POST(request) {
  try {
    const requestBody = await request.json();

    const token = parseAuthCookie(request.headers.get('cookie'));
    const payload = token ? verifyJwt(token) : null;
    if (!payload || (await verifyRole(payload.userId)).toLowerCase() !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized: Admin role required' },
        { status: 403 }
      );
    }

    // Destructure only allowed fields from request body to avoid mass-assignment
    const {
      name,
      description,
      type,
      unit,
      packing,
      HsnHac,
      weight,
      quality,
      price,
      salePrice,
      discount,
      buyPrice,
      isFeatured,
      isFreeShipping,
      isAvailable,
      isReturn,
      approved,
      url,
      sku,
      stockCount,
      title,
      thumbnailPath,
      imagePath,
      sizeChart,
      maxDt,
      expDt,
      category,
      tag,
      brand,
      rating,
      license
    } = requestBody;

    // Create the product
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        type,
        unit,
        packing,
        HsnHac,
        weight,
        quality,
        price,
        salePrice,
        discount,
        buyPrice,
        isFeatured,
        isFreeShipping,
        isAvailable,
        isReturn,
        approved,
        url,
        sku,
        stockCount,
        title,
        thumbnailPath,
        imagePath,
        sizeChart,
        maxDt,
        expDt,
        category,
        tag,
        brand,
        rating,
        license
      },
    });

    return NextResponse.json(
      { message: 'Product created successfully', product: newProduct },
      { status: 200 }
    );
  } catch (error) {
    console.error('[PRODUCT_CREATE_ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to create product', detail: error?.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  const { searchParams } = new URL(request.url);
  const numValue = Number(searchParams.get('productid'));
  const requestBody = await request.json();
  const token = parseAuthCookie(request.headers.get('cookie'));
  const payload = token ? verifyJwt(token) : null;

  if (!payload || (await verifyRole(payload.userId)) !== "admin") {
    return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 403 });
  }
  const product = await prisma.product.findUnique({
    where: {
      id: numValue
    }
  })
  if (!product) {
    return NextResponse.json({ error: 'Product does not exist' }, { status: 404 });
  }
  const newProduct = await prisma.product.update({
    data: requestBody,
    where: {
      id: numValue
    }
  });
  return NextResponse.json({ message: 'product updated', newProduct }, { status: 200 });
}
