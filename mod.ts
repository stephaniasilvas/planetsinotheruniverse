import { join } from "https://deno.land/std/path/mod.ts";
import {BufReader} from "https://deno.land/std/io/bufio.ts";
import {parse} from "https://deno.land/std/encoding/csv.ts";
import * as _ from "https://raw.githubusercontent.com/lodash/lodash/4.17.15-es/lodash.js"


interface Planet {
    [key: string] : string
}


// async function readFile(){

//     const path = join ("text_files", "hello.txt")
//     const data = await Deno.readTextFile(path);

//     console.log(data);
// }

// await readFile();

async function loadPlanetsData(){

    const path = join (".", "kepler_exoplanets_nasa.csv");
    const file = await Deno.open(path);
    const bufReader = new BufReader(file);
    const result = await parse (bufReader, {
            header: true,
            comment: "#",
    });
    Deno.close(file.rid);
    // Always close the file otherwise it will crash

    const planets = (result as Array <Planet>).filter((planet )=> {
        const planetaryRadius = Number(planet ["koi_prad"]);
        const stellarMass = Number(planet ["koi_smass"]);
        const stellarRadius = Number(planet ["koi_srad"]);


        return planet ["koi_disposition"] === "CONFIRMED"
            && planetaryRadius > 0.5 && planetaryRadius < 1.5
            && stellarMass > 0.78 && stellarMass < 1.04
            && stellarRadius > 0.99 && stellarRadius < 1.01;
    });

    return planets.map ((planet)=>{
        return _.pick(planet, [
            "koi_prad",
            "koi_smass",
            "koi_srad",
            "kepler_name",
            "koi_count",
            "koi_steff"
        ]);
    });
}

const newEarths = await loadPlanetsData();
for (const planet of newEarths){
    console.log(planet);
}
console.log(`${newEarths.length} habitable planets found`);
