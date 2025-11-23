export interface Badge {
    id: string;
    name: string;
    icon: string;
    description: string;
    earnedAt?: string;
}

export interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    type: 'Tam Zamanlı' | 'Yarı Zamanlı' | 'Staj';
    postedDate: string;
    matchScore: number;
    logo: string;
}

export interface ChatMessage {
    id: string;
    sender: 'user' | 'ai';
    text: string;
    timestamp: Date;
}

export interface ForumPost {
    id: string;
    user: string;
    avatar: string;
    date: string;
    content: string;
    likes: number;
    replies: number;
}

export interface LeaderboardUser {
    rank: number;
    name: string;
    avatar: string;
    points: number;
    trend: 'up' | 'down' | 'same';
}
