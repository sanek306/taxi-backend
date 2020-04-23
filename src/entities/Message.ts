import {
    BaseEntity, Column,
    CreateDateColumn, Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import Chat from "./Chat";
import User from "./User";

@Entity()
class Message extends BaseEntity {
    @PrimaryGeneratedColumn() id: number;

    @Column({ type: "text" })
    text: string;

    @ManyToOne(_type => Chat, chat => chat.messages)
    chat: Chat;

    @ManyToOne(_type => User, user=> user.messages)
    user: User;

    @CreateDateColumn() createdAt: string;

    @UpdateDateColumn() updatedAt: string;
}

export default Message;