import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '@src/app/decorators/roles.decorator';
import { RolesGuard } from '@src/app/guards/roles.guard';
import { DashboardService } from '@src/app/modules/dashboard/dashboard.service';
import { SuccessResponse } from '@src/app/types';
import { UserRole } from '@src/shared';

@ApiTags('Admin - Dashboard')
@ApiBearerAuth()
@Roles(UserRole.ADMIN)
@UseGuards(RolesGuard)
@Controller('admin/dashboard')
export class AdminDashboardGatewayController {
    constructor(private readonly dashboardService: DashboardService) {}

    @Get('stats')
    @ApiOperation({ summary: 'Get dashboard statistics' })
    async getStats() {
        const stats = await this.dashboardService.getStats();
        return new SuccessResponse('Dashboard stats fetched successfully', stats);
    }
}
