const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
    plugins: [
        new MonacoWebpackPlugin()
    ],
    module:{
        rules:[
            {
                test:/\.css$/,
                use:['style-loader','css-loader']
            }
        ]
    }
};
