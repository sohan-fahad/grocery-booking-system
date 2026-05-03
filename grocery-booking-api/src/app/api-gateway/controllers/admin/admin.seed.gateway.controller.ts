import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '@src/app/decorators/roles.decorator';
import { RolesGuard } from '@src/app/guards/roles.guard';
import { SeedService } from '@src/app/modules/seed/seed.service';
import { SuccessResponse } from '@src/app/types';
import { UserRole } from '@src/shared';

@ApiTags('Admin - Seed')
@ApiBearerAuth()
@Roles(UserRole.ADMIN)
@UseGuards(RolesGuard)
@Controller('admin/seed')
export class AdminSeedGatewayController {
    constructor(private readonly seedService: SeedService) {}

    @Post()
    @ApiOperation({ summary: 'Re-run seed (idempotent — skips existing records)' })
    async seed() {
        const result = await this.seedService.seed();
        return new SuccessResponse(result.message, result.summary);
    }
}
