
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { writeFile } from "fs/promises";
import { PrismaClient } from "@prisma/client";
import { authenticate, verifyAdmin, getUserId, handleHtmlToPdf,handleHtmlFromOrder } from "../utils/jwt"; // adjust import path if needed
import { MESSAGES } from "../utils/statusConstant";       // adjust import path if needed
import puppeteer from "puppeteer";
const prisma = new PrismaClient();

const handleError = (error) => {
    console.error(error);
    return NextResponse.json({ error: MESSAGES.SERVER_ERROR }, { status: 500 });
};

const unauthorized = () =>
    NextResponse.json({ error: MESSAGES.UNAUTHORIZED }, { status: 400 });

const baseDir = path.join(process.env.FILE_PATH, "/uploads");
const privateDir = path.join(process.env.FILE_PATH, "/private");

// Recursively collect file info
function getFiles(dir, base = "") {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    let files = [];

    for (const entry of entries) {
        const relativePath = path.join(base, entry.name);
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            files = files.concat(getFiles(fullPath, relativePath));
        } else {
            files.push({
                name: entry.name,
                publicPath: `/uploads/${relativePath.replace(/\\/g, "/")}`,
                absolutePath: fullPath,
            });
        }
    }

    return files;
}

export async function POST(request) {
    try {
        
        if(verifyAdmin(request)) {
            return NextResponse.json({ error: "Admin can generate invoice." }, { status: 400 });
        }
        const body = await request.json();
        const { html, orderId, userId } = body;

        if (!html) {
            return NextResponse.json({ error: "HTML content is required." }, { status: 400 });
        }

        // Filename for PDF
        const filename = `performa-invoice${orderId}.pdf`;

        // Launch Puppeteer
        const browser = await puppeteer.launch({
            headless: "new",
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });

        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: "networkidle0" });

        // Generate PDF buffer
        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: { top: 20, bottom: 20, left: 20, right: 20 },
        });

        await browser.close();

        // Set folder path
        const folderPath = path.join(process.env.FILE_PATH, "/invoice");

        // Ensure folder exists
        fs.mkdirSync(folderPath, { recursive: true });

        // Full file path
        const filePath = path.join(folderPath, filename);

        // Write file and **overwrite if exists** (default behavior)
        fs.writeFileSync(filePath, pdfBuffer); // ← overwrites automatically
        let asset = await prisma.assets.findFirst({ where: { "name": filename } });
        console.log(userId);
        if (!asset) {
            asset = await prisma.assets.create({
                data: {
                    name: filename,
                    type: "invoice",
                    path: "/invoice/" + filename,
                    author: userId?.toString(),
                    tag: filename
                },
            });
        }
        return NextResponse.json({
            message: "PDF generated & saved successfully",
            path: filePath,
            assetId: asset.id
        });

    } catch (error) {
        console.log("PDF generation error:", error);
        return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
    }
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    
    try {
        const id = Number(searchParams.get("orderId"));
      let order = await prisma.order.findUnique({where: {id: Number(id)}});
      if(!order){
        return NextResponse({"msg": "invalid order Id!"});
      }

      const { html, userId } = await handleHtmlFromOrder(Number(id));
        if (!html) {
            return NextResponse.json({ error: "HTML content is required." }, { status: 400 });
        }

        // Filename for PDF
        const filename = `performa-invoice${id}.pdf`;

        // Launch Puppeteer
        const browser = await puppeteer.launch({
            headless: "new",
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });

        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: "networkidle0" });

        // Generate PDF buffer
        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            landscape: true, 
            margin: { top: 10, bottom: 10, left: 5, right: 5 },
        });

        await browser.close();

        // Set folder path
        const folderPath = path.join(process.env.FILE_PATH, "/invoice");

        // Ensure folder exists
        fs.mkdirSync(folderPath, { recursive: true });

        // Full file path
        const filePath = path.join(folderPath, filename);

        // Write file and **overwrite if exists** (default behavior)
        fs.writeFileSync(filePath, pdfBuffer); // ← overwrites automatically
        let asset = await prisma.assets.findFirst({ where: { "name": filename } });
        if (!asset) {
            asset = await prisma.assets.create({
                data: {
                    name: filename,
                    type: "invoice",
                    path: "/invoice/" + filename,
                    author: userId?.toString(),
                    tag: filename
                },
            });
        }
        let orderUpdate = await prisma.order.update({where:{ id: Number(id) },data: {invoicepath: `${filePath}`}});
        return NextResponse.json({
            message: "PDF generated & saved successfully",
            path: filePath,
            assetId: asset.id
        });

    } catch (error) {
        console.log("PDF generation error:", error);
        return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
    }
}
