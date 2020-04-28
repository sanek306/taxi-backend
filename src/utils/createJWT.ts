import jwt from "jsonwebtoken";

const  createJWT = (id: number) : string =>
    jwt.sign({
        id
    }, process.env.JWT_TOKEN);


export default createJWT;