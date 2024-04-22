export const asyncHandler = (func) => async (req, res, next) => {
  return Promise.resolve(func(req, res, next)).catch((error) => next(error));
};

// same
// const asyncHandler = fn => {
//     async (req, res, next) => {}
// }

// const asyncHandler = fn => async (req, res, next) => {
//     try {
//        await fn(req, res, next)
//     } catch (error) {
//         res.status(error.status || 500).json({success: false, message: error?.message})
//     }
// }
