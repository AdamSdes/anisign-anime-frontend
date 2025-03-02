export interface Notification {
    id: number;
    title: string;
    description: string;
    type: 'episode' | 'friendRequest';
    timestamp: string;
    read: boolean;
}