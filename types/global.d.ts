// Global type definitions to fix TypeScript errors

import { Prisma } from '@prisma/client';

declare global {
  namespace PrismaJson {
    type CustomerOrderUserRelation = {
      user?: {
        id: string;
        email: string;
        name?: string | null;
        lastname?: string | null;
        phone?: string | null;
      } | null;
    };
    
    type CustomerOrderExtended = Prisma.Customer_orderGetPayload<{
      include: {
        products: {
          include: {
            product: true;
          };
        };
      };
    }> & {
      userId: string | null;
    };
  }
}

// Make this a module
export {};
