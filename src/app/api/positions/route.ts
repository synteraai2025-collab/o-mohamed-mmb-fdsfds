import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ROLE_PERMISSIONS } from '@/types';
import { z } from 'zod';

const positionSchema = z.object({
  title: z.string().min(2, 'Position title must be at least 2 characters'),
  titleAr: z.string().optional(),
  code: z.string().min(2, 'Position code must be at least 2 characters'),
  description: z.string().optional(),
  descriptionAr: z.string().optional(),
  departmentId: z.string().min(1, 'Department is required'),
  level: z.enum(['ENTRY', 'JUNIOR', 'MID', 'SENIOR', 'LEAD', 'MANAGER', 'DIRECTOR', 'EXECUTIVE']),
  minSalary: z.number().positive().optional(),
  maxSalary: z.number().positive().optional(),
  currency: z.string().optional(),
  isActive: z.boolean().default(true),
  reportsToId: z.string().optional(),
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
    
    if (!permissions.canViewPositions) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department') || '';
    const level = searchParams.get('level') || '';
    const includeInactive = searchParams.get('includeInactive') === 'true';

    const where: any = {};
    if (!includeInactive) {
      where.isActive = true;
    }

    if (department) {
      where.departmentId = department;
    }

    if (level) {
      where.level = level;
    }

    const positions = await prisma.position.findMany({
      where,
      include: {
        department: {
          select: {
            id: true,
            name: true,
            nameAr: true,
            code: true,
          }
        },
        reportsTo: {
          select: {
            id: true,
            title: true,
            titleAr: true,
          }
        },
        _count: {
          select: {
            employees: true
          }
        }
      },
      orderBy: {
        title: 'asc'
      }
    });

    return NextResponse.json({ data: positions });
  } catch (error) {
    console.error('Error fetching positions:', error);
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
    
    if (!permissions.canManagePositions) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Validate input
    const validationResult = positionSchema.safeParse(body);
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

    // Check if position code already exists
    const existingCode = await prisma.position.findUnique({
      where: { code: data.code }
    });

    if (existingCode) {
      return NextResponse.json(
        { error: 'Position code already exists' },
        { status: 409 }
      );
    }

    // Validate department
    const department = await prisma.department.findUnique({
      where: { id: data.departmentId }
    });

    if (!department) {
      return NextResponse.json(
        { error: 'Department not found' },
        { status: 404 }
      );
    }

    // Validate reportsTo position if provided
    if (data.reportsToId) {
      const reportsTo = await prisma.position.findUnique({
        where: { id: data.reportsToId }
      });

      if (!reportsTo) {
        return NextResponse.json(
          { error: 'Reports to position not found' },
          { status: 404 }
        );
      }

      // Check for circular reference
      if (data.reportsToId === data.departmentId) {
        return NextResponse.json(
          { error: 'Position cannot report to itself' },
          { status: 400 }
        );
      }
    }

    // Validate salary range
    if (data.minSalary && data.maxSalary && data.minSalary > data.maxSalary) {
      return NextResponse.json(
        { error: 'Minimum salary cannot be greater than maximum salary' },
        { status: 400 }
      );
    }

    // Create position
    const position = await prisma.position.create({
      data,
      include: {
        department: {
          select: {
            id: true,
            name: true,
            nameAr: true,
            code: true,
          }
        },
        reportsTo: {
          select: {
            id: true,
            title: true,
            titleAr: true,
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
        message: 'Position created successfully',
        data: position 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating position:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
