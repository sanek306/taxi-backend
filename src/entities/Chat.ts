import {
    BaseEntity, Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import Message from "./Message";
import User from "./User";

@Entity()
class Chat extends BaseEntity {
    @PrimaryGeneratedColumn() id: number;

    @OneToMany(() => Message, message => message.chat)
    messages: Message[];

    @Column({ nullable: true })
    passengerId: number;

    @ManyToOne(() => User, user=> user.chatsAsPassenger)
    passenger: User;

    @Column({ nullable: true })
    driverId: number;

    @ManyToOne(() => User, user=> user.chatsAsDriver)
    driver: User;

    @CreateDateColumn() createdAt: string;

    @UpdateDateColumn() updatedAt: string;
}

export default Chat;