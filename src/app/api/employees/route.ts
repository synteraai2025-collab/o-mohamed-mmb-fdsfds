import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ROLE_PERMISSIONS } from '@/types';
import { z } from 'zod';

const createEmployeeSchema = z.object({
  employeeId: z.string().min(1, 'Employee ID is required'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  hireDate: z.string().min(1, 'Hire date is required'),
  departmentId: z.string().min(1, 'Department is required'),
  positionId: z.string().min(1, 'Position is required'),
  managerId: z.string().optional(),
  salary: z.number().positive('Salary must be positive'),
  currency: z.string().default('USD'),
  employmentType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN', 'FREELANCE']),
  nationality: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']).optional(),
  maritalStatus: z.enum(['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED', 'SEPARATED']).optional(),
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
    
    if (!permissions.canViewEmployees) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const department = searchParams.get('department') || '';
    const status = searchParams.get('status') || '';
    const employmentType = searchParams.get('employmentType') || '';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { employeeId: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (department) {
      where.departmentId = department;
    }

    if (status) {
      where.status = status;
    }

    if (employmentType) {
      where.employmentType = employmentType;
    }

    // For department managers, only show employees in their department
    if (userRole === 'DEPARTMENT_MANAGER') {
      const managerEmployee = await prisma.employee.findUnique({
        where: { id: session.user.employeeId }
      });
      
      if (managerEmployee) {
        where.departmentId = managerEmployee.departmentId;
      }
    }

    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        skip,
        take: limit,
        include: {
          department: {
            select: {
              id: true,
              name: true,
              nameAr: true,
            }
          },
          position: {
            select: {
              id: true,
              title: true,
              titleAr: true,
            }
          },
          manager: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.employee.count({ where })
    ]);

    return NextResponse.json({
      data: employees,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
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
    
    if (!permissions.canCreateEmployees) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Validate input
    const validationResult = createEmployeeSchema.safeParse(body);
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

    // Check if employee ID already exists
    const existingEmployee = await prisma.employee.findUnique({
      where: { employeeId: data.employeeId }
    });

    if (existingEmployee) {
      return NextResponse.json(
        { error: 'Employee ID already exists' },
        { status: 409 }
      );
    }

    // Check if email already exists
    const existingEmail = await prisma.employee.findUnique({
      where: { email: data.email }
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      );
    }

    // Validate department and position
    const department = await prisma.department.findUnique({
      where: { id: data.departmentId }
    });

    if (!department) {
      return NextResponse.json(
        { error: 'Department not found' },
        { status: 404 }
      );
    }

    const position = await prisma.position.findUnique({
      where: { id: data.positionId }
    });

    if (!position) {
      return NextResponse.json(
        { error: 'Position not found' },
        { status: 404 }
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

    // Create employee
    const employee = await prisma.employee.create({
      data: {
        employeeId: data.employeeId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
        hireDate: new Date(data.hireDate),
        departmentId: data.departmentId,
        positionId: data.positionId,
        managerId: data.managerId,
        salary: data.salary,
        currency: data.currency,
        employmentType: data.employmentType,
        nationality: data.nationality,
        gender: data.gender,
        maritalStatus: data.maritalStatus,
      },
      include: {
        department: {
          select: {
            id: true,
            name: true,
            nameAr: true,
          }
        },
        position: {
          select: {
            id: true,
            title: true,
            titleAr: true,
          }
        },
        manager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        }
      }
    });

    return NextResponse.json(
      { 
        message: 'Employee created successfully',
        data: employee 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating employee:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
