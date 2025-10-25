import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { writeFile } from "fs/promises";
import { authenticate, verifyAdmin } from "../utils/jwt"; // adjust import path if needed
import { MESSAGES } from "../utils/statusConstant";       // adjust import path if needed

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

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get("file");

    // If ?file= is passed → return that file's absolute path
    if (fileName) {
      let files = getFiles(baseDir);
      let file = files.find(f => f.name === fileName);
      if (!file) {
        if(authenticate(request)) {
        files = getFiles(privateDir);
        file = files.find(f => f.name === fileName);
        if (!file)
          return NextResponse.json(
            { success: false, message: "File not found" },
            { status: 404 }
          );
      }
    }
      const mime = fileName.endsWith(".png")
        ? "image/png"
        : fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")
          ? "image/jpeg"
          : fileName.endsWith(".pdf")
            ? "application/pdf"
            : fileName.endsWith(".json")
              ? "application/json"
              : "application/octet-stream";
      const fileBuffer = fs.readFileSync(file.absolutePath);
      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          "Content-Type": mime,
          "Content-Disposition": `inline; filename="${fileName}"`,
        },
      });
    }

    // Otherwise, return all files
    const files = getFiles(baseDir);
    return NextResponse.json({ success: true, files });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  if (!authenticate(request)) return unauthorized();
  const { searchParams } = new URL(request.url);
  const type = Number(searchParams.get("type"));
  if (verifyAdmin(request) && type)
    try {
      // Parse multipart form data
      const formData = await request.formData();
      const file = formData.get("file");

      if (!file || typeof file === "string") {
        return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
      }
      const dir = type === 'public' ? path.join(process.env.FILE_PATH, "/uploads") : path.join(process.env.FILE_PATH, "/private");
      // Create unique filename
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = path.join(dir, fileName);

      // Save file
      await writeFile(filePath, buffer);

      // Public URL (relative to /public)
      const publicPath = `/` + type + `/${fileName}`;

      return NextResponse.json({
        message: "File uploaded successfully",
        path: publicPath,
      });
    } catch (error) {
      console.error("File upload error:", error);
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}