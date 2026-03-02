export interface UserProfile {
  name: string;
  handle: string;
  avatar: string;
  bio?: string;
  headerImage?: string;
  location?: string;
  website?: string;
  joinDate?: string;
}

export interface Tweet {
  id: string;
  content: string;
  images: string[];
  timestamp: number;
  user: UserProfile;
}
