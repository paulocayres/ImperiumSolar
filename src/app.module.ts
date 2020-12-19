import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SunModule } from './sun/sun.module';

@Module({
  //imports: [MongooseModule.forRoot('mongodb://paulo.cayres:pccr0976@ds263078.mlab.com:63078/imperium'), SunModule],
  imports: [MongooseModule.forRoot('mongodb+srv://paulo_cayres:pccr0976@cayres.bw85l.mongodb.net/<dbname>?retryWrites=true&w=majority'), SunModule],
  //mongodb+srv://paulo_cayres:<password>@cayres.bw85l.mongodb.net/<dbname>?retryWrites=true&w=majority
  //mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false
  //mongodb://paulo.cayres:pccr0976@ds263078.mlab.com:63078/imperium
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}