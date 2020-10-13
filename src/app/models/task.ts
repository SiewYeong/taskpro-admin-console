export class Task {
    id: string;
    title: string;
    content: string;
    consumer: string;
    provider: string;
    status: string;
    
    constructor() {
        this.content = '-';
        this.consumer = '-';
        this.provider = '-';
    }
}