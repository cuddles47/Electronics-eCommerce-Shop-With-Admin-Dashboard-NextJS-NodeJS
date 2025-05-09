import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

// GET all orders (admin only) or user's orders
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  
  try {
    // Admin can see all orders
    if (session.user.role === "admin") {      const orders = await prisma.customer_order.findMany({
        include: {
          products: {
            include: {
              product: true,
            },
          },
        },
        orderBy: {
          dateTime: "desc",
        },
      });
      return NextResponse.json(orders);
    }
      // Regular users can only see their own orders
    else {
      const orders = await prisma.customer_order.findMany({        where: {
          userId: session.user.id,
        },
        include: {
          products: {
            include: {
              product: true,
            },
          },
        },
        orderBy: {
          dateTime: "desc",
        },
      });
      return NextResponse.json(orders);
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

// Create new order
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  try {
    const body = await request.json();
    const {
      name,
      lastname,
      phone,
      email,
      company,
      adress,
      apartment,
      postalCode,
      city,
      country,
      orderNotice,
      total,
      products,
      paymentMethod,
    } = body;
    
    // Validate required fields
    if (!name || !lastname || !phone || !email || !adress || !postalCode || !city || !country || !total || !products || products.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }    // Create the order
    const order = await prisma.customer_order.create({
      data: {
        name,
        lastname,
        phone,
        email,
        company: company || "",
        adress,
        apartment: apartment || "",
        postalCode,
        city,
        country,
        orderNotice,
        total,
        paymentMethod: paymentMethod || "card",
        status: "pending",
        userId: session?.user?.id || null,
        products: {
          create: products.map((item: any) => ({
            product: {
              connect: {
                id: item.productId,
              },
            },
            quantity: item.quantity,
          })),
        },
      },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });

    // Update product stock quantities
    for (const item of products) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });
      
      if (product) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            inStock: Math.max(0, product.inStock - item.quantity)
          }
        });
      }
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
