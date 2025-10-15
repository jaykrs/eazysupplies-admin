import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const baseDir = path.join(process.env.FILE_PATH, "/uploads");

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
      const files = getFiles(baseDir);
      const file = files.find(f => f.name === fileName);
      if (!file) {
        return NextResponse.json(
          { success: false, message: "File not found" },
          { status: 404 }
        );
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
