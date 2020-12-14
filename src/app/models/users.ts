export class User {
  id: number;
  over18: boolean;
  discordUser: string;
  discriminator: number;
  faveGames?: string[];
  isGuardian: boolean;
  userDislikes?: string;
  userLikes?: string;
}
