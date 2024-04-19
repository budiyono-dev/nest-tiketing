export class RegisterUserReq {
    username: string;
    password: string;
    fullname: string;
    email: string;
}

export class RegisterUserRes {
    username: string;
    fullname: string;
}

export class LoginReq {
    username: string;
    password: string;
}

export class LoginRes {
    token: string;
}
