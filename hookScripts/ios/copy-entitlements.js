var fs = require('fs');
var path = require('path');

module.exports = function(context) {
    var srcFile = path.join(context.opts.projectRoot, '/platforms/ios/Koti/Entitlements-Debug.plist');
    var sourceExists = fs.existsSync(srcFile);

    if(sourceExists) {
        var destFile = path.join(context.opts.projectRoot, '/platforms/ios/Koti/Koti.entitlements');
        var destExists = fs.existsSync(destFile);

        if(!destExists) {
            fs.createReadStream(srcFile).pipe(fs.createWriteStream(destFile));
            console.log('INFO >> iOS entitlements copied');
        }
        else {
            console.log('INFO >> iOS entitlements already exists, copy skiped');
        }
    }
    else {
        console.log('ERROR >> iOS entitlements file does not exists');
    }
}