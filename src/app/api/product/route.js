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

    const {
      name,
      short_description,
      description,
      type,
      unit,
      weight= weight?.toString(),
      quantity,
      price = 0,
      sale_price = 0,
      discount = 0,
      is_featured = 0,
      shipping_days = 0,
      is_cod = 0,
      is_free_shipping = 0,
      is_sale_enable = 0,
      is_return = 0,
      is_trending = 0,
      is_approved = 0,
      is_external = 0,
      external_url,
      external_button_text,
      sale_starts_at,
      sale_expired_at,
      sku,
      is_random_related_products = 0,
      stock_status,
      meta_title,
      meta_description,
      product_thumbnail_id,
      product_meta_image_id,
      size_chart_image_id,
      estimated_delivery_text,
      return_policy_text,
      safe_checkout = 0,
      secure_checkout = 0,
      social_share = 0,
      encourage_order,
      encourage_view,
      slug,
      status = 0,
      store_id,
      tax_id,
      preview_type,
      product_type,
      separator,
      is_licensable = false,
      license_type,
      preview_url,
      watermark = false,
      watermark_position,
      brand_id,
      watermark_image_id,
      wholesale_price_type,
      is_licensekey_auto = false,
      preview_audio_file_id,
      preview_video_file_id
    } = requestBody;

    const newProduct = await prisma.product.create({
      data: {
        name,
        short_description,
        description,
        type,
        unit,
        weight: weight?.toString(),
        quantity,
        price,
        sale_price,
        discount,
        is_featured,
        shipping_days,
        is_cod,
        is_free_shipping,
        is_sale_enable,
        is_return,
        is_trending,
        is_approved,
        is_external,
        external_url,
        external_button_text,
        sale_starts_at,
        sale_expired_at,
        sku,
        is_random_related_products,
        stock_status,
        meta_title,
        meta_description,
        product_thumbnail_id,
        product_meta_image_id,
        size_chart_image_id,
        estimated_delivery_text,
        return_policy_text,
        safe_checkout,
        secure_checkout,
        social_share,
        encourage_order,
        encourage_view,
        slug,
        status,
        store_id,
        tax_id,
        preview_type,
        product_type,
        separator,
        is_licensable,
        license_type,
        preview_url,
        watermark,
        watermark_position,
        brand_id,
        watermark_image_id,
        wholesale_price_type,
        is_licensekey_auto,
        preview_audio_file_id,
        preview_video_file_id,
        created_by_id: String(payload.userId),
      }
    });

    return NextResponse.json(
      { message: 'Product created successfully', product: newProduct },
      { status: 201 }
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
  try {
    const { searchParams } = new URL(request.url);
    const productId = Number(searchParams.get("productid"));

    if (isNaN(productId)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const body = await request.json();
    const token = parseAuthCookie(request.headers.get("cookie"));
    const payload = token ? verifyJwt(token) : null;

    if (!payload || (await verifyRole(payload.userId)).toLowerCase() !== "admin") {
      return NextResponse.json({ error: "Unauthorized: Admin role required" }, { status: 403 });
    }

    const existingProduct = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Product does not exist" }, { status: 404 });
    }

    const {
      name,
      short_description,
      description,
      type,
      unit,
      weight= weight?.toString(),
      quantity,
      price,
      sale_price,
      discount,
      is_featured,
      shipping_days,
      is_cod,
      is_free_shipping,
      is_sale_enable,
      is_return,
      is_trending,
      is_approved,
      is_external,
      external_url,
      external_button_text,
      sale_starts_at,
      sale_expired_at,
      sku,
      is_random_related_products,
      stock_status,
      meta_title,
      meta_description,
      product_thumbnail_id,
      product_meta_image_id,
      size_chart_image_id,
      estimated_delivery_text,
      return_policy_text,
      safe_checkout,
      secure_checkout,
      social_share,
      encourage_order,
      encourage_view,
      slug,
      status,
      store_id,
      tax_id,
      preview_type,
      product_type,
      separator,
      is_licensable,
      license_type,
      preview_url,
      watermark,
      watermark_position,
      brand_id,
      watermark_image_id,
      wholesale_price_type,
      is_licensekey_auto,
      preview_audio_file_id,
      preview_video_file_id
    } = body;

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        short_description,
        description,
        type,
        unit,
        weight: weight?.toString(),
        quantity,
        price,
        sale_price,
        discount,
        is_featured,
        shipping_days,
        is_cod,
        is_free_shipping,
        is_sale_enable,
        is_return,
        is_trending,
        is_approved,
        is_external,
        external_url,
        external_button_text,
        sale_starts_at: sale_starts_at ? new Date(sale_starts_at) : undefined,
        sale_expired_at: sale_expired_at ? new Date(sale_expired_at) : undefined,
        sku,
        is_random_related_products,
        stock_status,
        meta_title,
        meta_description,
        product_thumbnail_id,
        product_meta_image_id,
        size_chart_image_id,
        estimated_delivery_text,
        return_policy_text,
        safe_checkout,
        secure_checkout,
        social_share,
        encourage_order,
        encourage_view,
        slug,
        status,
        store_id,
        tax_id,
        preview_type,
        product_type,
        separator,
        is_licensable,
        license_type,
        preview_url,
        watermark,
        watermark_position,
        brand_id,
        watermark_image_id,
        wholesale_price_type,
        is_licensekey_auto,
        preview_audio_file_id,
        preview_video_file_id
      }
    });

    return NextResponse.json({ message: "Product updated", product: updatedProduct }, { status: 200 });
  } catch (error) {
    console.error("[PRODUCT_UPDATE_ERROR]", error);
    return NextResponse.json({ error: "Failed to update product", detail: error?.message }, { status: 500 });
  }
}

