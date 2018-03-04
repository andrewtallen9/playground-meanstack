//making middleware!

function logit(req, res, next){
    console.log('LOGIT: Requested resource %s, %s', req.method, req.url);
    // we want to call the next middleware function, so use the next function
    next();
}

module.exports = logit;