import { generateResponse, asyncHandler } from '../utils/helpers.js';

const defaultHandler = asyncHandler(async (req, res, next) => {
    generateResponse(null, `${process.env.APP_NAME} API - Health check passed v1`, res);
});

export { defaultHandler }