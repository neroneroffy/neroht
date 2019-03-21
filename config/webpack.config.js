/**
 * Author: Zhou Haitao
 * Date: 2018/11/26 0026
 * Time: 23:43
 *
 */
module.exports = {
    module: {
        rules: [
            {
                test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                loader: require.resolve('url-loader'),
                options: {
                    limit: 8000,
                    name: 'img/[name].[hash:8].[ext]',
                },
            },
            {
                test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 100,
                    name: 'fonts/[name].[hash:8].[ext]'
                }
            }
        ]
    }
}
