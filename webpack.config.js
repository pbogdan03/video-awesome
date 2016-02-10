var autoprefixer = require('autoprefixer');
var HandlebarsPlugin = require('handlebars-webpack-plugin');

module.exports = {
    entry: __dirname + '/src/app.js',
    output: {
        path: __dirname + '/build',
        filename: 'bundle.js'
    },
    module: {
        loaders: [{
            test: /\.scss$/,
            loaders: ['style', 'css', 'postcss', 'sass']
        },
        {
            test: /\.js$/,
            exclude: /node_modules/,
            include: __dirname + '/src',
            loader: 'babel-loader',
            query: {
                cacheDirectory: true,
                presets: 'es2015'
            }
        }]
    },
    plugins: [
        new HandlebarsPlugin({
            entry: __dirname + '/src/index.hbs',
            output: __dirname + '/build/index.html',
            partials: [
                __dirname + '/src/components/**/*.hbs'
            ]
        })
    ],
    resolve: {
        extensions: ['', '.js']
    },
    postcss: [ autoprefixer({ browsers: ['last 2 versions'] }) ],
    watch: true
};
