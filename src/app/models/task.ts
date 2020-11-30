import { Author } from './author';

export class Task {
    id: string;
    category: string;
    title: string;
    description: string;
    additional_instruction: string;
    location: string;
    fee: number;
    tags: string;
    offer_deadline: any;
    task_deadline: any;
    status: string;
    author: Author;
    offer_num: number;
    offered_by: any; // reference
    is_complete_by_author: boolean;
    is_complete_by_provider: boolean;
    payment: any; // TODO: change to correct data type
    rating: number;
    created_at: any;
    created_by: any; // reference
    updated_at: any;
    updated_by: any; // reference
    
    constructor(
        id?: string,
        category?: string,
        title?: string,
        description?: string,
        additional_instruction?: string,
        location?: string,
        fee?: number,
        tags?: string,
        offer_deadline?: any,
        task_deadline?: any,
        status?: string,
        author?: Author,
        offer_num?: number,
        offer_by?: any,
        is_complete_by_author?: boolean,
        is_complete_by_provider?: boolean,
        payment?: any,
        rating?: number,
        service_provider?: any,
        created_at?: any,
        created_by?: any,
        updated_at?: any,
        updated_by?: any
    ) {
        this.description = '-';
    }
}