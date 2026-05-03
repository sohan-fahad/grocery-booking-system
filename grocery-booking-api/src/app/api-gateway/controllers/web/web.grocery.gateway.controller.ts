import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetGroceryItemDTO } from '@src/app/modules/grocery/dtos/grocery-item.dto';
import { GroceryService } from '@src/app/modules/grocery/services/grocery.service';

@ApiTags('Grocery')
@Controller('web/grocery')
export class WebGroceryGatewayController {
    constructor(
        private readonly service: GroceryService,
    ) { }

    @Get('')
    @ApiOperation({ summary: 'Get all grocery items' })
    async getItems(@Query() query: GetGroceryItemDTO) {
        return await this.service.getAllItems(query);
    }
}
