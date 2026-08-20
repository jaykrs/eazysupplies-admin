/**
 * Notifications API Route Handler
 * 
 * Provides RESTful API endpoints for notification management with authentication.
 * Handles CRUD operations for user notifications including marking as read/unread.
 * 
 * Key Features:
 * - JWT authentication for secure access
 * - Support for user-specific and broadcast notifications
 * - Case-insensitive field mapping (uppercase frontend ↔ lowercase database)
 * - Comprehensive error handling with environment-specific details
 * - Real-time notification status updates
 * - Backward compatibility with multiple field naming conventions
 * 
 * API Endpoints:
 * - GET /api/notifications - Fetch user notifications, optional mark-as-read by ID
 * - POST /api/notifications - Create new notification
 * - PUT /api/notifications - Mark notification as read
 * 
 * Authentication: JWT token required for all endpoints
 * Data Mapping: Automatically maps between frontend (PascalCase) and backend (camelCase)
 * 
 * @module NotificationsAPI
 * @author Simran Samir
 * @version 1.0.0
 */
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authenticate, verifyAdmin } from "../utils/jwt";
import { MESSAGES } from "../utils/statusConstant";

const prisma = new PrismaClient();

const handleError = (error) => {
  console.error("Server Error:", error);
  return NextResponse.json({ 
    error: MESSAGES.SERVER_ERROR,
    details: process.env.NODE_ENV === 'development' ? error.message : undefined 
  }, { status: 500 });
};

const unauthorized = () =>
  NextResponse.json({ error: MESSAGES.UNAUTHORIZED }, { status: 401 });

// GET – fetch notifications
export async function GET(request) {
  try {
    const payload = await authenticate(request);
    if (!payload) return unauthorized();
    const isAdmin = await verifyAdmin(request);

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    console.log("GET /api/notifications - User ID:", payload.userId);

    // If ID is provided, mark as read
    if (id) {
      const notification = await prisma.notification.update({
        where: { id: Number(id) },
        data: { readStatus: true }
      });
      
      return NextResponse.json({ 
        success: true,
        data: notification 
      });
    }

    // Fetch notifications for the user
    const notifications = await prisma.notification.findMany({
      where: {
        OR: [
          { recepient: payload.userId?.toString() || "" },
          { recepient: "all" },
          ...(isAdmin ? [{ recepient: "admin" }] : [])
        ]
      },
      orderBy: { createdAt: "desc" },
    });

    console.log(`Found ${notifications.length} notifications`);

    // Transform data to include uppercase aliases for frontend
    const transformedNotifications = notifications.map(notification => ({
      ...notification,
      // Add uppercase aliases for frontend compatibility
      Name: notification.name,
      Type: notification.type,
      Recipient: notification.recepient,
      Remarks: notification.remarks,
      CreatedOn: notification.createdAt,
      UpdatedOn: notification.updatedAt
    }));

    return NextResponse.json({ 
      notifications: transformedNotifications
    });
    
  } catch (err) {
    console.error("GET Error:", err);
    return handleError(err);
  }
}

// POST – create new notification
export async function POST(request) {
  try {
    const payload = await authenticate(request);
    if (!payload) return unauthorized();

    const body = await request.json();
    console.log("Received POST body:", body);
    
    // Map incoming data (accept both uppercase and lowercase)
    const notificationData = {
      // Map from uppercase (frontend) to lowercase (database)
      name: body.Name || body.name || "Notification",
      type: body.Type || body.type || "General",
      recepient: body.Recipient || body.recipient || body.recepient || "all",
      remarks: body.Remarks || body.remarks || "",
      readStatus: body.readStatus || false,
      sentStatus: body.sentStatus || false,
      data: body.data || null,
      attachment: body.attachment || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log("Mapped data for database:", notificationData);

    const notification = await prisma.notification.create({
      data: notificationData
    });

    // Return transformed response with uppercase aliases
    const responseData = {
      ...notification,
      // Add uppercase aliases for frontend
      Name: notification.name,
      Type: notification.type,
      Recipient: notification.recepient,
      Remarks: notification.remarks,
      CreatedOn: notification.createdAt,
      UpdatedOn: notification.updatedAt
    };

    return NextResponse.json({ 
      success: true, 
      data: responseData,
      message: "Notification created successfully" 
    }, { status: 201 });
    
  } catch (err) {
    console.error("POST Error:", err);
    return handleError(err);
  }
}

// PUT – mark as read
export async function PUT(request) {
  try {
    const payload = await authenticate(request);
    if (!payload) return unauthorized();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Notification ID is required" }, 
        { status: 400 }
      );
    }

    const updatedNotification = await prisma.notification.update({
      where: { id: Number(id) },
      data: { 
        readStatus: true,
        updatedAt: new Date()
      }
    });

    // Transform response
    const responseData = {
      ...updatedNotification,
      Name: updatedNotification.name,
      Type: updatedNotification.type,
      Recipient: updatedNotification.recepient,
      Remarks: updatedNotification.remarks,
      CreatedOn: updatedNotification.createdAt,
      UpdatedOn: updatedNotification.updatedAt
    };

    return NextResponse.json({ 
      success: true, 
      data: responseData 
    }, { status: 200 });
    
  } catch (err) {
    console.error("PUT Error:", err);
    return handleError(err);
  }
}
