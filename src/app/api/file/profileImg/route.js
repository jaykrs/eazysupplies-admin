import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { writeFile } from "fs/promises";
import { PrismaClient } from "@prisma/client";
import { authenticate, verifyAdmin, getUserId } from "../../utils/jwt";
import { unauthorized } from "next/navigation";
const prisma = new PrismaClient();

export async function POST(request) {
    const payload = await authenticate(request);
    if (!payload) return unauthorized();
    if (!payload.userId) {
        return NextResponse.json({ error: "No User available" }, { status: 400 });
    }
    try {
        // Parse multipart form data
        const formData = await request.formData();
        const file = formData.get("file");
        if (!file || typeof file === "string") {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const dir = path.join(process.env.FILE_PATH, "/uploads");
        // Create unique filename
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        let fname = file.name;
        fname = fname.replace(/\s+/g, '');
        const fileName = `${Date.now()}-${fname}`;
        const filePath = path.join(dir, fileName);

        // Save file
        await writeFile(filePath, buffer);
        let asset;

        // Public URL (relative to /public)
        const publicPath = `/` + "uploads" + `/${fileName}`;
        asset = await prisma.assets.create({
            data: {
                name: fileName,
                type: "public",
                path: publicPath,
                author: payload.userId.toString(),
                tag: fileName
            },
        });
        if (asset) {
            let user = await prisma.user.update({ where: { id: payload.userId }, data: { profileImagepath: publicPath } });
            return NextResponse.json({
                message: "File uploaded successfully",
                path: publicPath
            }, { status: 200 });
        } else {
            return NextResponse.json({
                message: "Something went wrong!",
                path: ''
            }, { status: 500 });
        }
    } catch (error) {
        console.log("File upload error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}

export async function PUT(request) {
    const payload = await authenticate(request);
    if (!payload) return unauthorized();
    if (!payload.userId) return NextResponse.json({ msg: "Invalid user" });
    const user = await prisma.user.update({ where: { id: payload.userId }, data: { profileImagepath: null } });
    return NextResponse.json({ msg: "Profile updated successfully!" });
}

