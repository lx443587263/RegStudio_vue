module.exports = {   
    devServer: {
        proxy: {
            '^/api': {
                target: 'http://127.0.0.1:8000/',//接口的前缀
                ws:true,//代理websocked
                changeOrigin:true,//虚拟的站点需要更管origin
                pathRewrite:{
                    '^/api':''//重写路径
                }
            }
        }
    }
}