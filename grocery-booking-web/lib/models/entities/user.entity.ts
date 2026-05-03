export type UserEntity = {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    picture: string;
    role: "admin" | "user";
    createdAt: Date;
    updatedAt: Date;
}