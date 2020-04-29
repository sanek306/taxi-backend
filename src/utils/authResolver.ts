
const  authResolver = resolverFunc => async (parent, args, context, info) => {
    if (!context.req.user) {
        throw new Error("No JWT. I refuse to proceed.")
    }
    return await resolverFunc(parent, args, context, info);
};

export default authResolver;