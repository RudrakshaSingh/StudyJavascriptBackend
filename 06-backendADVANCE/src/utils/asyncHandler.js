// The asyncHandler function is a higher-order function designed to simplify error handling 
// in asynchronous Express route handlers. Let’s break down how it works.

// Higher-Order Function:
// asyncHandler takes a function (requestHandler) as an argument and returns a new function. 
// This is what makes it a higher-order function.
const asyncHandler = (requestHandler) => {
    // The requestHandler is expected to be an asynchronous function, typically an Express route 
    // handler that takes req, res, and next as parameters.
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
}
// Promise.resolve(requestHandler(req, res, next)):
// This wraps the call to the requestHandler in a Promise. If requestHandler is an async function, it automatically returns a Promise.
// If the requestHandler resolves successfully, the response is handled normally.
// If it throws an error (or returns a rejected Promise), it will be caught by the .catch block.
export { asyncHandler }











//can also do it like this//higher order function
//using try catch
// const asyncHandler = (fn) => async (req,res,next) => {
//     try {
//         await fn(req,res,next);
//     } catch (error) {
//         res.status(error.code||500).json({
//             success: false,
//             message: error.message,
//         });
//     }
// };
