/**
 * Copyright 2014 Chris Barber (email: chris@chris-barber.co.uk)
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License, version 2, as
 * published by the Free Software Foundation.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 */

// This file contains nothing but an array of car objects

// Set up Cars:
var cars = [];

// Image Ref, Car Name, Car Country Ref, Top Speed, 0-60, Power, Engine Size cc, Weight Kgs
cars[0]  = { image: "005", name: "AC Cobra",                country: "150", speed: 160, sixty: 4.2, power: 485, engine: 6997, weight: 1148 };
cars[1]  = { image: "010", name: "Aston Martin DB9",        country: "100", speed: 186, sixty: 4.9, power: 450, engine: 5935, weight: 1750 };
cars[2]  = { image: "015", name: "Bentley Continental GT",  country: "100", speed: 196, sixty: 4.8, power: 552, engine: 5998, weight: 2385 };
cars[3]  = { image: "020", name: "BMW M3 CSL",              country: "110", speed: 155, sixty: 4.6, power: 360, engine: 3246, weight: 1460 };
cars[4]  = { image: "025", name: "Bugatti Veyron",          country: "120", speed: 252, sixty: 2.8, power: 987, engine: 7993, weight: 1600 };
cars[5]  = { image: "030", name: "Caterham R500",           country: "100", speed: 145, sixty: 3.5, power: 230, engine: 1796, weight: 460  };
cars[6]  = { image: "035", name: "Chevrolet Corvette Z06",  country: "150", speed: 172, sixty: 4.3, power: 405, engine: 5665, weight: 1413 };
cars[7]  = { image: "040", name: "Dodge Viper SRT-10",      country: "150", speed: 189, sixty: 4.0, power: 500, engine: 8285, weight: 1542 };
cars[8]  = { image: "045", name: "Ferrari 360 Stradale",    country: "120", speed: 188, sixty: 4.0, power: 425, engine: 3586, weight: 1280 };
cars[9]  = { image: "050", name: "Ferrari Enzo",            country: "120", speed: 218, sixty: 3.4, power: 650, engine: 5998, weight: 1365 };
cars[10] = { image: "055", name: "Ferrari F40",             country: "120", speed: 201, sixty: 3.9, power: 478, engine: 2936, weight: 1100 };
cars[11] = { image: "060", name: "Ford GT",                 country: "150", speed: 200, sixty: 3.8, power: 500, engine: 5409, weight: 1519 };
cars[12] = { image: "065", name: "Honda NSX Type R",        country: "130", speed: 168, sixty: 4.6, power: 276, engine: 3179, weight: 1270 };
cars[13] = { image: "070", name: "Jaguar XJ220",            country: "100", speed: 217, sixty: 3.6, power: 542, engine: 3500, weight: 1456 };
cars[14] = { image: "075", name: "Koenigsegg CC8S",         country: "140", speed: 235, sixty: 4.2, power: 655, engine: 4700, weight: 1275 };
cars[15] = { image: "080", name: "Lamborghini Countach",    country: "120", speed: 185, sixty: 4.8, power: 455, engine: 5167, weight: 1447 };
cars[16] = { image: "085", name: "Lamborghini Gallardo",    country: "120", speed: 192, sixty: 4.1, power: 493, engine: 4961, weight: 1520 };
cars[17] = { image: "090", name: "Lotus Esprit Sport 350",  country: "100", speed: 175, sixty: 4.3, power: 350, engine: 3506, weight: 1300 };
cars[18] = { image: "095", name: "Maserati MC12",           country: "120", speed: 205, sixty: 3.7, power: 622, engine: 5998, weight: 1335 };
cars[19] = { image: "100", name: "McLaren F1",              country: "100", speed: 240, sixty: 3.2, power: 627, engine: 6064, weight: 1137 };
cars[20] = { image: "105", name: "Mercedes SL55 AMG",       country: "110", speed: 155, sixty: 4.6, power: 493, engine: 5439, weight: 1880 };
cars[21] = { image: "110", name: "Mercedes SLR McLaren",    country: "110", speed: 207, sixty: 3.7, power: 617, engine: 5439, weight: 1693 };
cars[22] = { image: "115", name: "Mitsubishi Evo VIII",     country: "130", speed: 148, sixty: 4.9, power: 276, engine: 1997, weight: 1410 };
cars[23] = { image: "120", name: "Noble M12 GTO3R",         country: "100", speed: 170, sixty: 3.9, power: 352, engine: 2968, weight: 1080 };
cars[24] = { image: "125", name: "Pagani Zonda C12S",       country: "120", speed: 215, sixty: 3.8, power: 542, engine: 7010, weight: 1250 };
cars[25] = { image: "130", name: "Porsche 959",             country: "110", speed: 197, sixty: 3.9, power: 450, engine: 2851, weight: 1450 };
cars[26] = { image: "135", name: "Porsche GT3 RS",          country: "110", speed: 190, sixty: 4.3, power: 381, engine: 3600, weight: 1350 };
cars[27] = { image: "140", name: "Porsche Carrera GT",      country: "110", speed: 205, sixty: 3.7, power: 604, engine: 5733, weight: 1380 };
cars[28] = { image: "145", name: "Radical SR3 Turbo",       country: "100", speed: 160, sixty: 3.2, power: 320, engine: 1500, weight: 525  };
cars[29] = { image: "150", name: "Saleen S7",               country: "150", speed: 239, sixty: 3.3, power: 550, engine: 7008, weight: 1247 };
cars[30] = { image: "155", name: "Subaru Impreza WR1",      country: "130", speed: 155, sixty: 4.5, power: 316, engine: 1994, weight: 1470 };
cars[31] = { image: "160", name: "TVR Tuscan S",            country: "100", speed: 185, sixty: 3.8, power: 400, engine: 3996, weight: 1100 };
