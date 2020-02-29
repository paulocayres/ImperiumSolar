import { Controller, Get, Render, Post, Logger, Body, Param, Res, Redirect } from '@nestjs/common';
import { SunService } from '../sun/sun.service';
import { SunInputDto } from '../sun/suninput.dto';
import { resolveSoa } from 'dns';

@Controller('sun')
export class SunController {

    constructor(private sunService: SunService) { }


    @Get()
    @Render('sun')
    async get(): Promise<object> {
            const retorno = await this.sunService.getSunInputs();
            return { sunArray: retorno };
        //Logger.log("Controller " + JSON.stringify(retorno));
        
    }




    @Post('sunpost')
    @Redirect('../sun')
    async postSun(@Body() sunInput: SunInputDto, @Res() res) {
        //await this.sunService.setSunPositions(sunInput);
        this.sunService.setSunPositions(sunInput);
    }




}
