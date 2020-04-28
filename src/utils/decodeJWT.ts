import jwt from "jsonwebtoken";
import User from "../entities/User";

const  decodeJWT = async(token: string) : Promise<User | undefined> => {
  try {
      const { id }: any = jwt.verify(token, process.env.JWT_TOKEN);
      return await User.findOne( { id });
  } catch (e) {
      return undefined;
  }
};

export default decodeJWT;