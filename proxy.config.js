const PROXY_CONFIG = [
    {
        context: [
            "/api",
            "/Email/api",
            "/LeadPage/api",
            "/Images",
            "/Email/Images",
            "/LeadPage/Images"
        ],
        target: "http://localhost:49699/",
        // target: "http://localhost/",
        // target: "http://www.nicheshack.com/",
        secure: false,
        pathRewrite: {'Email/|LeadPage/' : ''},
        "changeOrigin": true
    }
]
module.exports = PROXY_CONFIG;