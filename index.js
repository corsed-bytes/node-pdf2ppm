const spawn = require('cross-spawn');
const path = require('path');

const defaultConfig = {
    first: 0, /* -f number: Specifies the first page to convert. */
    last: undefined, /* -l number: Specifies the last page to convert. */
    resolutionX: undefined, /* -rx number: Specifies the X resolution, in DPI. The default is 150 DPI. */
    resolutionY: undefined, /* -ry number: Specifies the Y resolution, in DPI. The default is 150 DPI. */
    resolution: undefined, /* -r number: Specifies the X and Y resolution, in DPI. The default is 150 DPI. */
    scaleX: undefined, /* -scale-to-x number: Scales each page horizontally to fit in scale-to-x pixels. */
    scaleY: undefined, /* -scale-to-y number: Scales each page vertically to fit in scale-to-y pixels. */
    scale: undefined, /* -scale-to number: Scales each page to fit in scale-to*scale-to pixel box. */
    cropX: undefined, /* -x number: Specifies the x-coordinate of the crop area top left corner */
    cropY: undefined, /* -y number: Specifies the y-coordinate of the crop area top left corner */
    cropWidth: undefined, /* -W number: Specifies the width of crop area in pixels (default is 0) */
    cropHeight: undefined, /* -H number: Specifies the height of crop area in pixels (default is 0) */
    cropSize: undefined, /* -sz number: Specifies the size of crop square in pixels (sets W and H) */
    format: 'png',
        // 'mono' -mono: Generate a monochrome PBM file (instead of a color PPM file). */
        // 'gray' -gray: Generate a grayscale PGM file (instead of a color PPM file). */
        // 'png' -png: Generates a PNG file instead a PPM file. */
    freetype: true, /* -freetype yes | no: Enable or disable FreeType (a TrueType / Type 1 font rasterizer). This defaults to "yes". */
    antiAliasing: true, /* -aa yes | no: Enable or disable font anti-aliasing. This defaults to "yes". */
    antiAliasingVector: true, /* -aaVector yes | no: Enable or disable vector anti-aliasing. This defaults to "yes". */
    filename: 'default',
    ownerPassword: undefined, /* -opw password: Specify the owner password for the PDF file. Providing this will bypass all security restrictions. */
    userPassword: undefined, /* -upw password: Specify the user password for the PDF file. */
    quiet: false, /* -q: Don't print any messages or errors. */
    copyright: false /* -v: Print copyright and version information. */
}

const pdf2ppm = (pdfPath, outDir, config={}, cb) => {
    if(!pdfPath || !outDir)
        return cb && cb('Missing parameter: pdfPath and outDir') || console.log('Missing parameter: pdfPath and outDir');

    config = {...defaultConfig, ...config};

    const convert = (input, outDir, _config, cb) => {
        const args = [];
        if(_config.first !== undefined) args.push('-f', _config.first);
        if(_config.last !== undefined) args.push('-l', _config.last);
        if(_config.resolutionX !== undefined) args.push('-rx', _config.resolutionX);
        if(_config.resolutionY !== undefined) args.push('-ry', _config.resolutionY);
        if(_config.resolution !== undefined) args.push('-r', _config.resolution);
        if(_config.scaleX !== undefined) args.push('-scale-to-x', _config.scaleX);
        if(_config.scaleY !== undefined) args.push('-scale-to-y', _config.scaleY);
        if(_config.scale !== undefined) args.push('-scale-to', _config.scale);
        if(_config.cropX !== undefined) args.push('-x', _config.cropX);
        if(_config.cropY !== undefined) args.push('-y', _config.cropY);
        if(_config.cropWidth !== undefined) args.push('-W', _config.cropWidth);
        if(_config.cropHeight !== undefined) args.push('-H', _config.cropHeight);
        if(_config.cropSize !== undefined) args.push('-sz', _config.cropSize);
        if(_config.format === 'png') args.push('-png');
        if(_config.format === 'mono') args.push('-mono');
        if(_config.format === 'gray') args.push('-gray');
        if(_config.freetype) args.push('-freetype', 'yes');
        if(_config.antiAliasing) args.push('-aa', 'yes');
        if(_config.antiAliasingVector) args.push('-aaVector', 'yes');
        if(_config.ownerPassword !== undefined) args.push('-opw', _config.ownerPassword);
        if(_config.userPassword !== undefined) args.push('-upw', _config.userPassword);
        if(_config.quiet) args.push('-q');
        if(_config.copyright) args.push('-v');
        args.push(input);
        args.push(path.join(outDir, _config.filename));

        const pdf2ppm = spawn('pdftoppm', args, { stdio: 'inherit' });

        pdf2ppm.on('close', () => fs.readdir(path.join(outDir), (err, files) => err ?
            cb(err):
            cb(null, files.filter(file => (!fs.lstatSync(path.resolve(outDir, file)).isDirectory())).filter(_ => _.includes(_config.filename)))
        ));
        pdf2ppm.on('error', (e) => cb(e));
    } 

    if(cb)
        return convert(pdfPath, outDir, config, cb);
    else
        return new Promise((res, rej) => convert(pdfPath, outDir, config, (err, data) => !!err ? rej(err) : res(data)));
};

module.exports = pdf2ppm;
