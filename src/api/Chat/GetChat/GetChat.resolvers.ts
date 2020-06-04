import { Resolvers } from "src/types/resolvers";
import authResolver from "../../../utils/authResolver";
import User from "../../../entities/User";
import {GetChatQueryArgs, GetChatResponse} from "../../../types/graph";
import Chat from "../../../entities/Chat";

const resolvers: Resolvers = {
    Query: {
        GetChat: authResolver(async (_, args: GetChatQueryArgs, { req }) : Promise<GetChatResponse> => {
            const user: User = req.user;
            const { chatId } = args;
            try {
                const chat = await Chat.findOne({
                    id: chatId
                }, { relations: ["passenger", "driver", "messages"]});
                if (chat) {
                    if(chat.passengerId === user.id || chat.driverId === user.id) {
                        return {
                            ok: true,
                            error: null,
                            chat
                        }
                    }
                    else {
                        return {
                            ok: false,
                            error: "Not authorized to see this chat",
                            chat: null
                        }
                    }
                } else {
                    return {
                        ok: false,
                        error: "Chat not found",
                        chat: null
                    }
                }
            }
            catch (e) {
                return {
                    ok: true,
                    error: e.message,
                    chat: null
                }
            }
        })
    }
};

export default resolvers;