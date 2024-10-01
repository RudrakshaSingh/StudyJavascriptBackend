class ApiError extends Error {
  constructor(
    status, 
    message = "Default:Something went wrong", 
    errors = [], 
    stack = ""//error stack
    ) {
        super(message);//override error message
        this.status = status;//override statuscode
        this.data=null
        this.message = message;
        this.success = false;
        this.errors = errors;//replace errors
        
        //to tell in which file error is//removed in production
        if (stack) {
            this.stack = stack;
        }else{
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError }