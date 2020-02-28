import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SunInput } from './suninput.interface';
import { SunInputDto } from './sunInput.dto';
import { Model } from 'mongoose';
import * as Sun from 'suncalc';

@Injectable()
export class SunService {

    constructor(
        @InjectModel('SunInput') private readonly sunModel: Model<SunInput>,
    ) { }


    async setSunPositions(sunInputDto: SunInputDto): Promise<SunInput[]> {

        const dataini = new Date(sunInputDto.dataini).toString();
        const times = new Date(sunInputDto.dataini);
        const dtf = new Date(sunInputDto.datafim);
        const datafim = new Date(sunInputDto.datafim).toString();
        const horaini = sunInputDto.horaini;
        const horafim = sunInputDto.horafim;
        const lati: any = sunInputDto.latitude;
        const longi: any = sunInputDto.longitude;
        const latitude = sunInputDto.latitude;
        const longitude = sunInputDto.longitude;
        const sAltura = sunInputDto.sAltura;
        const limElev = sunInputDto.limElev;
        const passo = sunInputDto.passo;
        let positions: SunInput[] = [];
        let sun: any;
        let nAzimute: number;
        let dir: number;
        let azimute: string;
        let nElevacao: number;
        let elevacao: string;
        let elev: number;
        let comp: number;
        let sDirecao: string;
        let sComprimento: string;
        let time: string;
        let sunInputDto2: SunInputDto;

        this.sunModel.collection.drop();
        while (times < dtf) {
            sun = Sun.getPosition(times, lati, longi);
            nAzimute = ((sun.azimuth * 180 / Math.PI)) + 180;
            dir = nAzimute + 180;
            if (dir > 360) {
                dir = dir - 360;
            }
            dir = (Math.round(dir));
            azimute = (Math.round(nAzimute * 100) / 100).toString();
            nElevacao = (sun.altitude * 180 / Math.PI);
            elevacao = (Math.round(nElevacao * 100) / 100).toString();
            elev = (sun.altitude * 180 / Math.PI);
            if (times.getHours() >= parseFloat(horaini) && times.getHours() <= parseFloat(horafim) && elev > parseFloat(limElev)) {
                comp = parseFloat(sAltura) / Math.tan(parseFloat(sun.altitude));
                sDirecao = dir.toString();
                sComprimento = (Math.round(comp * 100) / 100).toString();
                time = times.toString();
                // positions.push({ dataini, datafim, time, latitude, longitude, azimute, elevacao,_
                // sComprimento, sDirecao, sAltura, limElev, passo });
                sunInputDto = {
                    dataini, datafim, time,
                    latitude, longitude,
                    azimute, elevacao,
                    sComprimento, sDirecao, sAltura,
                    limElev, passo, horaini, horafim,
                };
                positions.push(sunInputDto);
/*                 const createdSun = new this.sunModel(sunInputDto);
                await createdSun.save(); */

                //this.sunModel.save(sunInputDto);
                // createdSun.save(sunInput);
                // createdSun.save();
            }
            times.setMinutes(times.getMinutes() + parseFloat(passo));

        }
        await this.sunModel.insertMany(positions);
        
        return positions;
        
        
    }



    async getSunInputs(): Promise<any> {
        let positions: SunInput[] = [];
        for (var i = 0; i <= 360; i++) {
            positions.push( await this.sunModel.findOne({ sDirecao: i }).sort({ sComprimento: -1 }).exec())
        }
        return positions;
    }

}
