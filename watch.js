var babel = require('babel-core');
var fs = require('fs');

fs.watch('./src', (eventType, filename) => {

    console.log('修改文件 ./src/' + filename);

    var { code } = babel.transformFileSync('./src/' + filename);
    
    if (filename.slice(filename.lastIndexOf('.') + 1) === 'jsx') {
        filename = filename.slice(0, -1);
    }

    fs.writeFile('./dist/' + filename, code, 'utf8', (err) => {});
})