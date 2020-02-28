import { Controller, Get, Render, Post, Logger, Body, Param, Res, Redirect } from '@nestjs/common';
import { SunService } from '../sun/sun.service';
import { SunInputDto } from '../sun/suninput.dto';

@Controller('sun')
export class SunController {

    constructor(private sunService: SunService) { }


    @Get()
    @Render('sun')
    async get(): Promise<object> {
        const retorno = await this.sunService.getSunInputs();
        //Logger.log("Controller " + JSON.stringify(retorno));
        return { sunArray: retorno };
    }



    @Post()
    @Render('sun')
    async postSun(@Body() sunInput: SunInputDto): Promise<object> {
        //await this.sunService.setSunPositions(sunInput);
        const temp = await this.sunService.setSunPositions(sunInput);
        //Logger.log(JSON.stringify(temp[0]));
        const retorno = await this.sunService.getSunInputs();
        
        //Logger.log(JSON.stringify(retorno));
        return { sunArray: retorno };

    }




}
