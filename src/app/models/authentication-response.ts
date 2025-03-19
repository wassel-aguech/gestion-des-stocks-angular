import { User } from "./user";

export class AuthenticationResponse {
    access_token! : string;
    refresh_token! : string;
    user!: User;



}
