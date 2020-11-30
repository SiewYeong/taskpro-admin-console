export class Notification {
    id: string;
    content: string;
    createdAt: any;
    createdBy: any; // reference
    imageHeader: string;
    isSeen: boolean;
    sentAt: any;
    sentTo: string;
    title: string;
    
    constructor(
        id?: string,
        content?: string,
        createdAt?: any,
        createdBy?: any,
        imageHeader?: string,
        isSeen?: boolean,
        sentAt?: any,
        sentTo?: string,
        title?: string
        ) { }
}