module.exports = {
    entry: {
        "analytics-module": ['core-js/stable/promise', 'url-polyfill', './src/']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        libraryTarget: 'umd',
        filename: 'index.js',
        globalObject: 'this',
        environment: {
            arrowFunction: false
        }
    }
};
