type UserLike = {
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
  name?: string | null;
  email?: string | null;
};

export function getUserInitial(user: UserLike | null | undefined): string {
  if (user?.firstName) return user.firstName.charAt(0).toUpperCase();
  if (user?.username) return user.username.charAt(0).toUpperCase();
  if (user?.name) return user.name.charAt(0).toUpperCase();
  if (user?.email) return user.email.charAt(0).toUpperCase();
  return "U";
}

export function getDisplayName(user: UserLike | null | undefined): string {
  if (user?.firstName && user?.lastName) return `${user.firstName} ${user.lastName}`;
  if (user?.firstName) return user.firstName;
  if (user?.username) return user.username;
  if (user?.name) return user.name;
  return "User";
}
