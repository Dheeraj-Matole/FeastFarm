//This is to catch the error and display instead of breakin the app

class expressError extends Error{
    constructor(message, statusCode){
        super();
        this.message= message;
        this.statusCode = statusCode;
    }
}

module.exports = expressError;