const { getUserId } = require("../../utils/authUtils");

const clearCache = (clearCache: any) => async (
    req: any,
    res: any,
    next: any
) => {
    await next();
    clearCache(getUserId(req));
};

export default clearCache;
