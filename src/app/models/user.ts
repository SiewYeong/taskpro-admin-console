export class User {
    id: string;
    idnum: string;
    name: string;
    ph_num: string;
    email: string;
    joined: any;
    status: number;
    role: string;
    
    constructor(
        id?: string,
        idnum?: string,
        name?: string,
        ph_num?: string,
        email?: string,
        joined?: any,
        status?: number,
        role?: string
        ) {
            this.id = id;
            this.idnum = idnum;
            this.name = name;
            this.ph_num = ph_num;
            this.email = email;
            this.joined = joined;
            this.status = status;
            this.role = role;
    }
}