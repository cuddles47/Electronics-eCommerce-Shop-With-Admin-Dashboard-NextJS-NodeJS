import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

// GET a single order by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const orderId = params.id;
    
    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }      const order = await prisma.customer_order.findUnique({
        where: {
          id: orderId,
        },
        include: {
          products: {
            include: {
              product: true,
            },
          },
        },
      });
      
      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }
      
      // For safety, fetch order with user to check permission
      const fullOrder = await prisma.customer_order.findUnique({
        where: { id: orderId },
        select: { userId: true }
      });
      
      // Check if the user is allowed to access this order
      if (session.user.role !== "admin" && fullOrder?.userId !== session.user.id) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
      }
    
    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

// PATCH update order status
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Only admins can update order status
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }
    
    const orderId = params.id;
    const { status, paymentStatus, trackingNumber } = await request.json();
    
    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }
    
    // Prepare update data
    const updateData: any = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (trackingNumber) updateData.trackingNumber = trackingNumber;
    
    const updatedOrder = await prisma.customer_order.update({
      where: {
        id: orderId,
      },
      data: updateData,
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });
    
    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}

// DELETE an order (admin only)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Only admins can delete orders
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }
    
    const orderId = params.id;
    
    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }
    
    // First delete the order products relation
    await prisma.customer_order_product.deleteMany({
      where: {
        customerOrderId: orderId,
      },
    });
    
    // Then delete the order
    await prisma.customer_order.delete({
      where: {
        id: orderId,
      },
    });
    
    return NextResponse.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json({ error: "Failed to delete order" }, { status: 500 });
  }
}
