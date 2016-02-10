var autoprefixer = require('autoprefixer');

module.exports = {
    entry: __dirname + '/src/index.js',
    output: {
        path: __dirname + '/src',
        filename: 'bundle.js'
    },
    module: {
        loaders: [{
            test: /\.scss$/,
            loaders: ['style', 'css', 'postcss', 'sass']
        },
        {
            test: /\.css$/,
            exclude: __dirname + '/lib/{components, themes}/',
            loaders: ['style', 'css']
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
        },
        {
            test: /\.hbs/,
            loader: 'handlebars-template-loader'
        },
        {
            test: /\.(png|woff|woff2|eot|ttf|svg)$/,
            loader: 'url-loader?limit=100000'
        }]
    },
    resolve: {
        extensions: ['', '.js']
    },
    postcss: [ autoprefixer({ browsers: ['last 2 versions'] }) ],
    watch: true
};
