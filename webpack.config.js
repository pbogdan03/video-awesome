var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');

module.exports = {
    entry: [
        path.resolve(__dirname, 'src', 'index'),
        path.resolve(__dirname, 'src', 'styles.scss')
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
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
            include: path.resolve(__dirname, 'src'),
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
        modulesDirectories: ['node_modules', 'bower_components'],
        extensions: ['', '.js']
    },
    plugins: [
        new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('bower.json', ['main'])
        )
    ],
    postcss: [ autoprefixer({ browsers: ['last 2 versions'] }) ],
    watch: true,
    devServer: {
        contentBase: './dist'
    },
    devtool: 'source-map'
};
