import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { requirePermission } from '@/middleware/auth';

// Validation schemas
const updateEmployeeSchema = z.object({
  employeeId: z.string().min(1, 'Employee ID is required').optional(),
  firstName: z.string().min(2, 'First name must be at least 2 characters').optional(),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email address').optional(),
  phone: z.string().min(10, 'Phone number must be at least 10 characters').optional(),
  dateOfBirth: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid date of birth',
  }).optional(),
  hireDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid hire date',
  }).optional(),
  departmentId: z.string().min(1, 'Department ID is required').optional(),
  position: z.string().min(2, 'Position must be at least 2 characters').optional(),
  salary: z.number().positive('Salary must be positive').optional(),
  employmentType: z.enum(['full-time', 'part-time', 'contract', 'intern']).optional(),
  status: z.enum(['active', 'inactive', 'terminated', 'on-leave']).optional(),
  managerId: z.string().optional(),
  profilePhoto: z.string().url().optional(),
  address: z.object({
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(1, 'ZIP code is required'),
    country: z.string().min(1, 'Country is required'),
  }).optional(),
  emergencyContact: z.object({
    name: z.string().min(2, 'Emergency contact name is required'),
    relationship: z.string().min(1, 'Relationship is required'),
    phone: z.string().min(10, 'Emergency contact phone is required'),
    email: z.string().email('Invalid emergency contact email').optional(),
  }).optional(),
  bankDetails: z.object({
    bankName: z.string().min(1, 'Bank name is required'),
    accountNumber: z.string().min(1, 'Account number is required'),
    routingNumber: z.string().min(1, 'Routing number is required'),
    accountType: z.enum(['checking', 'savings']),
  }).optional(),
});

// GET /api/employees/[id] - Get employee by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permissions
    const hasPermission = requirePermission('employee', 'read')(request);
    if (!hasPermission) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { id } = params;

    const employee = await prisma.employee.findUnique({
      where: { id },
      include: {
        department: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        manager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            employeeId: true,
            position: true,
          },
        },
        managedEmployees: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            employeeId: true,
            position: true,
          },
        },
      },
    });

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: employee,
    });
  } catch (error) {
    console.error('Error fetching employee:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/employees/[id] - Update employee
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permissions
    const hasPermission = requirePermission('employee', 'update')(request);
    if (!hasPermission) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { id } = params;
    const body = await request.json();
    const validationResult = updateEmployeeSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Check if employee exists
    const existingEmployee = await prisma.employee.findUnique({
      where: { id },
    });

    if (!existingEmployee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    // Check if employee ID is being changed and if it conflicts
    if (data.employeeId && data.employeeId !== existingEmployee.employeeId) {
      const employeeWithSameId = await prisma.employee.findUnique({
        where: { employeeId: data.employeeId },
      });

      if (employeeWithSameId) {
        return NextResponse.json(
          { error: 'Employee ID already exists' },
          { status: 409 }
        );
      }
    }

    // Check if email is being changed and if it conflicts
    if (data.email && data.email !== existingEmployee.email) {
      const employeeWithSameEmail = await prisma.employee.findUnique({
        where: { email: data.email },
      });

      if (employeeWithSameEmail) {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 409 }
        );
      }
    }

    // Check if department exists if being changed
    if (data.departmentId) {
      const department = await prisma.department.findUnique({
        where: { id: data.departmentId },
      });

      if (!department) {
        return NextResponse.json(
          { error: 'Department not found' },
          { status: 404 }
        );
      }
    }

    // Check if manager exists if being changed
    if (data.managerId) {
      const manager = await prisma.employee.findUnique({
        where: { id: data.managerId },
      });

      if (!manager) {
        return NextResponse.json(
          { error: 'Manager not found' },
          { status: 404 }
        );
      }
    }

    // Prepare update data
    const updateData: any = { ...data };
    
    if (data.dateOfBirth) {
      updateData.dateOfBirth = new Date(data.dateOfBirth);
    }
    
    if (data.hireDate) {
      updateData.hireDate = new Date(data.hireDate);
    }

    const employee = await prisma.employee.update({
      where: { id },
      data: updateData,
      include: {
        department: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        manager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            employeeId: true,
            position: true,
          },
        },
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'UPDATE',
        resource: 'employee',
        resourceId: id,
        changes: data,
      },
    });

    return NextResponse.json({
      success: true,
      data: employee,
    });
  } catch (error) {
    console.error('Error updating employee:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/employees/[id] - Delete employee
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permissions - only Owner and HR Admin can delete employees
    const hasPermission = requireRole('HR Admin')(request);
    if (!hasPermission) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { id } = params;

    // Check if employee exists
    const employee = await prisma.employee.findUnique({
      where: { id },
      include: {
        managedEmployees: true,
        leaves: true,
        payrolls: true,
      },
    });

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    // Check if employee has any managed employees
    if (employee.managedEmployees.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete employee who manages other employees' },
        { status: 400 }
      );
    }

    // Check if employee has any leaves
    if (employee.leaves.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete employee with existing leave records' },
        { status: 400 }
      );
    }

    // Check if employee has any payroll records
    if (employee.payrolls.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete employee with existing payroll records' },
        { status: 400 }
      );
    }

    // Delete employee
    await prisma.employee.delete({
      where: { id },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'DELETE',
        resource: 'employee',
        resourceId: id,
        changes: { deletedEmployee: employee },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Employee deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting employee:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
