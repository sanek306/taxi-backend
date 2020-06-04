import { Resolvers } from "src/types/resolvers";
import {
    SendChatMessageMutationArgs, SendChatMessageResponse
} from "../../../types/graph";
import authResolver from "../../../utils/authResolver";
import User from "../../../entities/User";
import Message from "../../../entities/Message";
import Chat from "../../../entities/Chat";

const resolvers: Resolvers = {
    Mutation: {
        SendChatMessage: authResolver(async (_, args: SendChatMessageMutationArgs, { req, pubSub }) : Promise<SendChatMessageResponse> => {
            const user: User = req.user;
            const { chatId, text } = args;
            try {
                const chat = await Chat.findOne({ id: chatId });
                if (chat) {
                    if(chat.passengerId === user.id || chat.driverId === user.id) {
                        const message = await Message.create({ text, chat, user }).save();
                        pubSub.publish("newChatMessage", { MessageSubscription: message });

                        return {
                            ok: true,
                            error: null,
                            message
                        }
                    } else {
                        return {
                            ok: false,
                            error: "You're not participate to this chat",
                            message: null
                        }
                    }
                } else {
                    return {
                        ok: false,
                        error: "Chat not found",
                        message: null
                    }
                }
            } catch (e) {
                return {
                    ok: false,
                    error: e.message,
                    message: null
                }
            }
        })
    }
};

export default resolvers;