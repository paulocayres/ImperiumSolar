import { Controller, Get, Logger, Redirect } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Redirect('/sun')
  getHello(): string {
    Logger.log("entrou na rota inicial");
    return '';
  }
}
