const fs = require('node:fs/promises');
const xml2js = require('xml2js');
const util = require('util')
processFiles();

async function processFiles() {
    const parser = new xml2js.Parser();

    const files =  await fs.readdir(__dirname);
    const MSQFiles = files.filter(fn=>fn.endsWith('.msq'));
    
    MSQFiles.forEach(async(msq)=>{

        const contents = await fs.readFile(__dirname + "/" + msq);

        parser.parseString(contents, function (err, result) {
            const veTableText = result.msq.page[2].constant[0]._;
            const values = processVeText(veTableText);
            console.log(msq,',',util.inspect(values,{maxArrayLength:256,compact:true, breakLength:10000}));
        });
    

    })
}
function processVeText(text) {
    let values=[];
    const lines = text.split('\n').filter(s => s.trim().length > 3).forEach(l => {
        l = l.trim();
        const data = l.split(' ').map(n => Number(n));
        values=values.concat(data);
    });
    return values;
}