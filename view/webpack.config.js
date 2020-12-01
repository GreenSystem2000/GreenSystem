const HTMLWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const webpack = require('webpack')

const filesPath = '../wwwroot'

module.exports = [{
    entry: './src/list-products/list-products.component.ts',
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: 'ts-loader',
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' }
                ]
            }
        ]
    },
    output: {
        filename: '[name]-[hash].js',
        path: path.resolve(__dirname, filesPath)
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, 'src/list-products', 'list-products.component.html')
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    target: 'web'
}, {
    entry: './src/login/login.component.ts',
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: 'ts-loader',
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' }
                ]
            }
        ]
    },
    output: {
        filename: '[name]-[hash].js',
        path: path.resolve(__dirname, `${filesPath}/login`)
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, 'src/login', 'login.component.html')
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    target: 'web'
}, {
    entry: './src/signup-user/signup.component.ts',
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: 'ts-loader',
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' }
                ]
            }
        ]
    },
    output: {
        filename: '[name]-[hash].js',
        path: path.resolve(__dirname, `${filesPath}/signup-user`)
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, 'src/signup-user', 'signup.component.html')
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    target: 'web'
}, {
    entry: './src/product-details/product-details.component.ts',
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: 'ts-loader',
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' }
                ]
            }
        ]
    },
    output: {
        filename: '[name]-[hash].js',
        path: path.resolve(__dirname, `${filesPath}/product-details`)
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, 'src/product-details', 'product-details.component.html')
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    target: 'web'
}, {
    entry: './src/carrinho/carrinho.component.ts',
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: 'ts-loader',
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' }
                ]
            }
        ]
    },
    output: {
        filename: '[name]-[hash].js',
        path: path.resolve(__dirname, `${filesPath}/carrinho`)
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, 'src/carrinho', 'carrinho.component.html')
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    target: 'web'
}, {
    entry: './src/finalizar-compra/finalizar-compra.component.ts',
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: 'ts-loader',
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' }
                ]
            }
        ]
    },
    output: {
        filename: '[name]-[hash].js',
        path: path.resolve(__dirname, `${filesPath}/finalizar-compra`)
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, 'src/finalizar-compra', 'finalizar-compra.component.html')
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    target: 'web'
}, {
    entry: './src/admin-panel/admin-panel.component.ts',
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: 'ts-loader',
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' }
                ]
            }
        ]
    },
    output: {
        filename: '[name]-[hash].js',
        path: path.resolve(__dirname, `${filesPath}/admin-panel`)
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, 'src/admin-panel', 'admin-panel.component.html')
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    target: 'web'
}, {
    entry: './src/change-infos/change-infos.component.ts',
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: 'ts-loader',
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' }
                ]
            }
        ]
    },
    output: {
        filename: '[name]-[hash].js',
        path: path.resolve(__dirname, `${filesPath}/change-infos`)
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, 'src/change-infos', 'change-infos.component.html')
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    target: 'web'
}, {
    entry: './src/purchase-user/purchase-user.component.ts',
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: 'ts-loader',
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' }
                ]
            }
        ]
    },
    output: {
        filename: '[name]-[hash].js',
        path: path.resolve(__dirname, `${filesPath}/purchase-user`)
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, 'src/purchase-user', 'purchase-user.component.html')
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    target: 'web'
}]