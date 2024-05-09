const { writeFileSync, mkdirSync } = require('fs');

require('dotenv').config();

const path = './src/environments';
const envFileContent = `
export const environment = {
  mapbox_key: "${ process.env['MAPBOX_KEY'] }",
  otra: "PROPIEDAD"
};
`;

mkdirSync(path, { recursive: true });
writeFileSync( path+"/environment.development.ts", envFileContent );
writeFileSync( path+"/environment.ts", envFileContent );

//environments/
//environment.development.ts
//environment.ts
