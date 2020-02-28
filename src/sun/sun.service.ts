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


    async setSunPositions(sunInput: SunInputDto): Promise<SunInput[]> {

        const dataini = new Date(sunInput.dataini).toString();
        const times = new Date(sunInput.dataini);
        const dtf = new Date(sunInput.datafim);
        const datafim = new Date(sunInput.datafim).toString();
        const horaini = sunInput.horaini;
        const horafim = sunInput.horafim;
        const lati: any = sunInput.latitude;
        const longi: any = sunInput.longitude;
        const latitude = sunInput.latitude;
        const longitude = sunInput.longitude;
        const sAltura = sunInput.sAltura;
        const limElev = sunInput.limElev;
        const passo = sunInput.passo;
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
                sunInput = {
                    dataini, datafim, time,
                    latitude, longitude,
                    azimute, elevacao,
                    sComprimento, sDirecao, sAltura,
                    limElev, passo, horaini, horafim,
                };
                positions.push(sunInput);
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
