import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as hbs from 'hbs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.useStaticAssets(join(__dirname, '..', 'public/css'));
  app.useStaticAssets(join(__dirname, '..', 'public/images'));
  app.useStaticAssets(join(__dirname, '..', 'public/js'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
/*   app.useStaticAssets(path.join(__dirname, 'public'));
  app.useStaticAssets(path.join(__dirname, 'public/css'));
  app.useStaticAssets(path.join(__dirname, 'public/images'));
  app.useStaticAssets(path.join(__dirname, 'public/js'));
  app.setBaseViewsDir(path.join(__dirname, 'views'));
  app.setViewEngine('hbs'); */
  hbs.registerPartials(join(__dirname, '..', 'views/partials'));
/*   hbs.registerPartials(__dirname + '/views/partials');
  hbs.registerPartial('head', 'head'); */
  hbs.registerPartial('head', 'head');
  app.enableCors();
  app.use(
    require('node-sass-middleware')({
      src: join(__dirname, '..', 'public/css'),
      dest: join(__dirname, '..', 'public/css'),
      debug: true,
      outputStyle: 'compressed',
    }),
  );
  await app.listen(process.env.PORT || 4000);
}
bootstrap();
