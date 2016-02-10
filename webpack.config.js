module.exports = {
    entry: "./client.js",
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    module: {
        loaders: [
            { 
                test: /\.scss$/,
                loaders: ["style", "css", "sass"] 
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    cacheDirectory: true,
                    presets: 'es2015'
                }
            }
        ]
    },
    resolve: {
        extensions: ['', '.js']
    },
    watch: true
};