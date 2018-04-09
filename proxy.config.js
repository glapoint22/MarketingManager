const PROXY_CONFIG = [
    {
        context: [
            "/api",
            "/Images"
        ],
        target: "http://localhost:49699/",
        secure: false
    }
]
module.exports = PROXY_CONFIG;