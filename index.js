const fs = require('fs');
const xml2js = require('xml2js');
const util = require('util')
processFiles();

function processFiles() {
    const parser = new xml2js.Parser();
    const dir = __dirname+"/";
    const files = fs.readdirSync(dir);
    const MSQFiles = files.filter(fn => fn.endsWith('.msq'));

    MSQFiles.sort(function (a, b) {
        return fs.statSync(dir + a).mtime.getTime() -
            fs.statSync(dir + b).mtime.getTime();
    });


    MSQFiles.forEach((msq) => {

        const contents = fs.readFileSync(dir + msq);

        parser.parseString(contents, function (err, result) {
            const veTableText = result.msq.page[2].constant[0]._;
            const values = processVeText(veTableText);
            let data = msq;
            values.forEach(v => data = data + "\t" + v);
            console.log(data);
        });


    })
}
function processVeText(text) {
    let values = [];
    const lines = text.split('\n').filter(s => s.trim().length > 3).forEach(l => {
        l = l.trim();
        const data = l.split(' ').map(n => Number(n));
        values = values.concat(data);
    });
    return values;
}