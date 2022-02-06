const expressjwt = require ('express-jwt') ;


function authJtw () {

    const secret = process.env.SECRET;
    const api = process.env.API_URL;

    return expressjwt({
        secret,
        algorithms : ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path: 
        [
            {url: /\/api\/products(.*)/, methods: ['GET', 'OPTIONS']},
            {url: /\/api\/categories(.*)/, methods: ['GET', 'OPTIONS']},
            `${api}/users/login`,
            `${api}/users/register`,

        ]
    })
}

async function isRevoked(req, payload, done){
    if (!payload.isAdmin){
        return done(null, true)
    }

    done();
}


module.exports = authJtw;