import { Controller, Get, Render, Post, Logger, Body, Param, Res, Redirect } from '@nestjs/common';
import { SunService } from '../sun/sun.service';
import { SunInputDto } from '../sun/suninput.dto';

@Controller('sun')
export class SunController {

    constructor(private sunService: SunService) { }




    @Get()
    @Render('sun')
    async get() {
            return '';
    }

    @Get('sunget')
    @Render('sun')
    async getSun(): Promise<object> {
            const retorno = await this.sunService.getSunInputs();
            return { sunArray: retorno };        
    }



    @Post('sunpost')
    @Render('sun')
    async postSun(@Body() sunInput: SunInputDto): Promise<object> {
        const retorno = await this.sunService.setSunPositions(sunInput);
        return { sunArray: retorno }; 
    }
}
