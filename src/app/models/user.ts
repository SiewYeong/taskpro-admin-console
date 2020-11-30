export class User {
    id: string;
    idnum: string;
    name: string;
    ph_num: string;
    email: string;
    joined: any;
    status: number;
    role: string;
    deleted_at: any;
    
    constructor(
        id?: string,
        idnum?: string,
        name?: string,
        ph_num?: string,
        email?: string,
        joined?: any,
        status?: number,
        role?: string,
        deleted_at?: any
        ) { }
}