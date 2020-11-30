import { Author } from './author';

export class Report {
    id: string;
    author: Author;
    category: string;
    subCategory: string;
    title: string;
    description: string;
    suggestion: string;
    profileId: string;
    profileRef: any; // reference
    taskId: string;
    taskRef: any; // reference
    status: string;
    createdAt: any;
    createdBy: any; // reference
    assignTo: string;
    
    constructor(
        id?: string,
        author?: Author,
        category?: string,
        subCategory?: string,
        title?: string,
        description?: string,
        suggestion?: string,
        profileId?: string,
        profileRef?: any,
        taskId?: string,
        taskRef?: any,
        status?: string,
        createdAt?: any,
        createdBy?: any,
        assignTo?: string
        ) { }
}