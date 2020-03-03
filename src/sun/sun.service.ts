import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SunInput } from '../sun/suninput.interface';
import { SunInputDto } from '../sun/suninput.dto';
import { Model } from 'mongoose';
import * as Sun from 'suncalc';


@Injectable()
export class SunService {

    constructor(
        @InjectModel('SunInput') private sunModel: Model<SunInput>,
    ) { }


    async setSunPositions(sunInputDto: SunInputDto) {

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
        let positions: SunInputDto[][] = [];
        let contador: number = 0;
        let positions_consolidada: Array<SunInputDto> = [];
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

        // inicializando array multidimensional.
        for (var i = 0; i <= 359; i++) {
            positions.push([]);
        }


        this.sunModel.collection.drop();
        while (times < dtf) {
            sun = Sun.getPosition(times, lati, longi);
            nAzimute = ((sun.azimuth * 180 / Math.PI)) + 180;
            dir = nAzimute + 180;
            dir = (Math.round(dir));
            if (dir >= 360) {
                dir = dir - 360;
            }
            azimute = (Math.round(nAzimute * 100) / 100).toString();
            nElevacao = (sun.altitude * 180 / Math.PI);
            elevacao = (Math.round(nElevacao * 100) / 100).toString();
            elev = (sun.altitude * 180 / Math.PI);
            if (times.getHours() >= parseFloat(horaini) && times.getHours() <= parseFloat(horafim) && elev > parseFloat(limElev)) {
                comp = parseFloat(sAltura) / Math.tan(parseFloat(sun.altitude));
                sDirecao = dir.toString();
                sComprimento = (Math.round(comp * 100) / 100).toString();
                time = times.toString();
                sunInputDto = {
                    dataini, datafim, time,
                    latitude, longitude,
                    azimute, elevacao,
                    sComprimento, sDirecao, sAltura,
                    limElev, passo, horaini, horafim,
                };
                positions[sDirecao].push(sunInputDto);
                contador++
            }
            times.setMinutes(times.getMinutes() + parseFloat(passo));
        }

        for (var i = 0; i <= 359; i++) {
                var pos = positions[i];
                positions_consolidada[i] = pos[0];
                for (var j = 1; j < pos.length; j++) {
                        if (parseFloat(pos[j].sComprimento) > parseFloat(positions_consolidada[i].sComprimento)) {
                            positions_consolidada[i] = pos[j];
                        }
                }
        }

        for (var i = 0; i <= 359; i++) {
            if (positions_consolidada[i] === undefined){
                Logger.log("Posição " + i + ": " + JSON.stringify(positions_consolidada[i]));
                positions_consolidada[i]={
                    dataini : "", datafim : "", time : "",
                    latitude : "", longitude : "",
                    azimute : "", elevacao : "",
                    sComprimento : "", sDirecao : "", sAltura : "",
                    limElev : "", passo : "", horaini : "", horafim : "",
                }
            }
        }

        await this.sunModel.insertMany(positions_consolidada);


    }

    async getSunInputs(): Promise<any> {
        let positions: SunInput[] = [];
        positions = await this.sunModel.find();
        return positions;
    }

}
