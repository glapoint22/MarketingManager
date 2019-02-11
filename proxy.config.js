const PROXY_CONFIG = [
    {
        context: [
            "/api",
            "/Images"
        ],
        target: "http://localhost:49699/",
        // target: "http://localhost/",
        // target: "http://www.nicheshack.com/",
        secure: false,
        "changeOrigin": true
    }
]
module.exports = PROXY_CONFIG;