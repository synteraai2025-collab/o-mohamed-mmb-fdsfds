import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ROLE_PERMISSIONS } from '@/types';
import { z } from 'zod';

const updateDepartmentSchema = z.object({
  name: z.string().min(2, 'Department name must be at least 2 characters').optional(),
  nameAr: z.string().optional(),
  code: z.string().min(2, 'Department code must be at least 2 characters').optional(),
  description: z.string().optional(),
  descriptionAr: z.string().optional(),
  managerId: z.string().optional(),
  parentId: z.string().optional(),
  isActive: z.boolean().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;

    const department = await prisma.department.findUnique({
      where: { id },
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
          select: {
            id: true,
            name: true,
            nameAr: true,
            code: true,
            isActive: true,
          }
        },
        _count: {
          select: {
            employees: true
          }
        }
      }
    });

    if (!department) {
      return NextResponse.json(
        { error: 'Department not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(department);
  } catch (error) {
    console.error('Error fetching department:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;
    const body = await request.json();
    
    // Validate input
    const validationResult = updateDepartmentSchema.safeParse(body);
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

    // Check if department exists
    const existingDepartment = await prisma.department.findUnique({
      where: { id }
    });

    if (!existingDepartment) {
      return NextResponse.json(
        { error: 'Department not found' },
        { status: 404 }
      );
    }

    // Check if code is being updated and if it already exists
    if (data.code && data.code !== existingDepartment.code) {
      const codeExists = await prisma.department.findUnique({
        where: { code: data.code }
      });

      if (codeExists) {
        return NextResponse.json(
          { error: 'Department code already exists' },
          { status: 409 }
        );
      }
    }

    // Validate manager if provided
    if (data.managerId !== undefined) {
      if (data.managerId === null) {
        // Allow removing manager
      } else {
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
    }

    // Validate parent department if provided
    if (data.parentId !== undefined) {
      if (data.parentId === null) {
        // Allow removing parent
      } else {
        // Check for circular reference
        if (data.parentId === id) {
          return NextResponse.json(
            { error: 'Department cannot be its own parent' },
            { status: 400 }
          );
        }

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
    }

    // Update department
    const department = await prisma.department.update({
      where: { id },
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
        message: 'Department updated successfully',
        data: department 
      }
    );
  } catch (error) {
    console.error('Error updating department:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;

    // Check if department exists
    const department = await prisma.department.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            employees: true,
            children: true
          }
        }
      }
    });

    if (!department) {
      return NextResponse.json(
        { error: 'Department not found' },
        { status: 404 }
      );
    }

    // Check if department has employees
    if (department._count.employees > 0) {
      return NextResponse.json(
        { error: 'Cannot delete department with employees' },
        { status: 400 }
      );
    }

    // Check if department has child departments
    if (department._count.children > 0) {
      return NextResponse.json(
        { error: 'Cannot delete department with sub-departments' },
        { status: 400 }
      );
    }

    // Delete department
    await prisma.department.delete({
      where: { id }
    });

    return NextResponse.json(
      { message: 'Department deleted successfully' }
    );
  } catch (error) {
    console.error('Error deleting department:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
