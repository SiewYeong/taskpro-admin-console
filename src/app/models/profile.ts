export class Profile {
    id: string;
    name: string;
    ph_num: string;
    email: string;
    joined: any;
    status: number;
    about: string;
    achievement: string;
    gallery: Array<any>;
    profile_pic: string;
    rating: number;
    review_num: number;
    services: string;
    task_completed: number;
    task_posted: number;

    constructor(
        id?: string,
        name?: string,
        ph_num?: string,
        email?: string,
        joined?: any,
        status?: number,
        about?: string,
        achievement?: string,
        gallery?: Array<any>,
        profile_pic?: string,
        rating?: number,
        review_num?: number,
        services?: string,
        task_completed?: number,
        task_posted?: number
        ) { }
}