var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var HandlebarsPlugin = require("handlebars-webpack-plugin");

module.exports = {
    entry: [
        path.resolve(__dirname, 'src', 'index'),
        path.resolve(__dirname, 'src', 'styles.scss')
    ],
    output: {
        path: __dirname,
        filename: 'bundle.js',
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
            test: /\.hbs$/,
            loader: 'handlebars-template-loader'
        },
        {
            test: /\.(png|woff|woff2|eot|ttf|svg|jpg)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: 'url-loader?limit=100000'
        },
        {
            test: /\.json$/, loader: 'json-loader'
        }]
    },
    resolve: {
        modulesDirectories: ['node_modules', 'bower_components', 'src/components/'],
        extensions: ['', '.js']
    },
    plugins: [
        new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('bower.json', ['main'])
        ),
        new HandlebarsPlugin({
            // path to main hbs template
            entry: path.join(process.cwd(), "src", "index.hbs"),
            // filepath to result
            output: path.join(process.cwd(), "dist", "index.html"),

            // globbed path to partials, where folder/filename is unique
            partials: [
                path.join(process.cwd(), "src", "components", "*", "*.hbs")
            ]
        })
    ],
    postcss: [ autoprefixer({ browsers: ['last 2 versions'] }) ],
    watch: true,
    devServer: {
        contentBase: './dist'
    },
    devtool: 'source-map'
};
