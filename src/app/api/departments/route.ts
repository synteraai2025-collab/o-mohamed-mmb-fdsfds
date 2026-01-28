import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ROLE_PERMISSIONS } from '@/types';
import { z } from 'zod';

const departmentSchema = z.object({
  name: z.string().min(2, 'Department name must be at least 2 characters'),
  nameAr: z.string().optional(),
  code: z.string().min(2, 'Department code must be at least 2 characters'),
  description: z.string().optional(),
  descriptionAr: z.string().optional(),
  managerId: z.string().optional(),
  parentId: z.string().optional(),
  isActive: z.boolean().default(true),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check permissions
    const userRole = session.user.role;
    const permissions = ROLE_PERMISSIONS[userRole];
    
    if (!permissions.canViewDepartments) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';
    const includeHierarchy = searchParams.get('includeHierarchy') === 'true';

    const where: any = {};
    if (!includeInactive) {
      where.isActive = true;
    }

    if (includeHierarchy) {
      // Get hierarchical structure
      const departments = await prisma.department.findMany({
        where,
        include: {
          manager: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            }
          },
          parent: {
            select: {
              id: true,
              name: true,
              nameAr: true,
              code: true,
            }
          },
          children: {
            include: {
              manager: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                }
              }
            }
          }
        },
        orderBy: {
          name: 'asc'
        }
      });

      // Build hierarchy tree
      const buildHierarchy = (departments: any[], parentId: string | null = null): any[] => {
        return departments
          .filter(dept => dept.parentId === parentId)
          .map(dept => ({
            ...dept,
            children: buildHierarchy(departments, dept.id)
          }));
      };

      const hierarchy = buildHierarchy(departments);
      return NextResponse.json({ data: hierarchy });
    } else {
      // Get flat list
      const departments = await prisma.department.findMany({
        where,
        include: {
          manager: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            }
          },
          parent: {
            select: {
              id: true,
              name: true,
              nameAr: true,
              code: true,
            }
          },
          _count: {
            select: {
              employees: true
            }
          }
        },
        orderBy: {
          name: 'asc'
        }
      });

      return NextResponse.json({ data: departments });
    }
  } catch (error) {
    console.error('Error fetching departments:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check permissions
    const userRole = session.user.role;
    const permissions = ROLE_PERMISSIONS[userRole];
    
    if (!permissions.canManageDepartments) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Validate input
    const validationResult = departmentSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Check if department code already exists
    const existingCode = await prisma.department.findUnique({
      where: { code: data.code }
    });

    if (existingCode) {
      return NextResponse.json(
        { error: 'Department code already exists' },
        { status: 409 }
      );
    }

    // Validate manager if provided
    if (data.managerId) {
      const manager = await prisma.employee.findUnique({
        where: { id: data.managerId }
      });

      if (!manager) {
        return NextResponse.json(
          { error: 'Manager not found' },
          { status: 404 }
        );
      }
    }

    // Validate parent department if provided
    if (data.parentId) {
      const parent = await prisma.department.findUnique({
        where: { id: data.parentId }
      });

      if (!parent) {
        return NextResponse.json(
          { error: 'Parent department not found' },
          { status: 404 }
        );
      }
    }

    // Create department
    const department = await prisma.department.create({
      data,
      include: {
        manager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        },
        parent: {
          select: {
            id: true,
            name: true,
            nameAr: true,
            code: true,
          }
        },
        _count: {
          select: {
            employees: true
          }
        }
      }
    });

    return NextResponse.json(
      { 
        message: 'Department created successfully',
        data: department 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating department:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
