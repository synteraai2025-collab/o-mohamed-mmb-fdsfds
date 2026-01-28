import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ROLE_PERMISSIONS } from '@/types';

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

    const { id } = params;
    
    // Check permissions - employees can view their own financial data
    const userRole = session.user.role;
    const permissions = ROLE_PERMISSIONS[userRole];
    
    if (!permissions.canViewPayroll && session.user.employeeId !== id) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Get employee financial details
    const employee = await prisma.employee.findUnique({
      where: { id },
      select: {
        id: true,
        salary: true,
        currency: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    // Get current payroll components (latest payroll or default configuration)
    const latestPayroll = await prisma.payroll.findFirst({
      where: { employeeId: id },
      orderBy: { createdAt: 'desc' },
      include: {
        allowances: {
          include: {
            allowanceType: true
          }
        },
        deductions: {
          include: {
            deductionType: true
          }
        },
        bonuses: {
          include: {
            bonusType: true
          }
        }
      }
    });

    // Get default allowance types
    const defaultAllowances = await prisma.allowanceType.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        isTaxable: true,
        defaultAmount: true,
        description: true
      }
    });

    // Get default deduction types
    const defaultDeductions = await prisma.deductionType.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        isTaxDeductible: true,
        defaultAmount: true,
        description: true
      }
    });

    // Get default bonus types
    const defaultBonuses = await prisma.bonusType.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        isTaxable: true,
        defaultAmount: true,
        description: true,
        frequency: true
      }
    });

    // Format the response
    const financialData = {
      id: employee.id,
      employeeId: employee.id,
      basicSalary: Number(employee.salary),
      currency: employee.currency,
      allowances: latestPayroll 
        ? latestPayroll.allowances.map(a => ({
            id: a.id,
            name: a.allowanceType.name,
            amount: Number(a.amount),
            isTaxable: a.isTaxable,
            description: a.description || a.allowanceType.description
          }))
        : defaultAllowances.map(a => ({
            id: a.id,
            name: a.name,
            amount: Number(a.defaultAmount || 0),
            isTaxable: a.isTaxable,
            description: a.description
          })),
      deductions: latestPayroll
        ? latestPayroll.deductions.map(d => ({
            id: d.id,
            name: d.deductionType.name,
            amount: Number(d.amount),
            isTaxDeductible: d.isTaxDeductible,
            description: d.description || d.deductionType.description
          }))
        : defaultDeductions.map(d => ({
            id: d.id,
            name: d.name,
            amount: Number(d.defaultAmount || 0),
            isTaxDeductible: d.isTaxDeductible,
            description: d.description
          })),
      bonuses: latestPayroll
        ? latestPayroll.bonuses.map(b => ({
            id: b.id,
            name: b.bonusType.name,
            amount: Number(b.amount),
            isTaxable: b.isTaxable,
            description: b.description || b.bonusType.description,
            frequency: b.bonusType.frequency
          }))
        : defaultBonuses.map(b => ({
            id: b.id,
            name: b.name,
            amount: Number(b.defaultAmount || 0),
            isTaxable: b.isTaxable,
            description: b.description,
            frequency: b.frequency
          })),
      effectiveDate: latestPayroll ? latestPayroll.payPeriodStart : employee.createdAt,
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt
    };

    return NextResponse.json(financialData);
  } catch (error) {
    console.error('Error fetching employee financial data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
