export interface Author {
    name: string;
    avatar: string;
}
  
export interface Comment {
    id: number; 
    author: Author; 
    content: string; 
    date: string;
    hearts: number; 
    animeId: string; 
    animeName: string; 
}