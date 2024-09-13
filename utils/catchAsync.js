//Wrapper to call the ExpressError conviniently

module.exports = func => {
    return(req, res, next) => {
        func(req,res,next).catch(next);
    }
}