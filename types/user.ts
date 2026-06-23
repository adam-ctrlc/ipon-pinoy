export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImage: string | null;
}
