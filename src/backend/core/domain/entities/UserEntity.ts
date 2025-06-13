export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly username: string,
    public readonly puntos: number,
    public readonly aciertos: number,
    public readonly total_apostados: number,
    public readonly precision: number,
    public readonly racha: number,
    public readonly role: "user" | "admin",
    public readonly created_at: string,
  ) {}

  static fromPrimitives(p: {
    id: string;
    email: string;
    username: string;
    puntos: number;
    aciertos: number;
    total_apostados: number;
    precision: number;
    racha: number;
    role: "user" | "admin";
    created_at: string;
  }): UserEntity {
    return new UserEntity(
      p.id,
      p.email,
      p.username,
      p.puntos,
      p.aciertos,
      p.total_apostados,
      p.precision,
      p.racha,
      p.role,
      p.created_at,
    );
  }

  toRankingView(currentUserId: string) {
    return {
      id: this.id,
      nombre: this.username,
      puntos: this.puntos,
      aciertos: this.aciertos,
      total: this.total_apostados,
      precision: this.precision,
      racha: this.racha,
      avatar: `https://api.dicebear.com/7.x/initials/png?seed=${this.username}`,
      esUsuario: this.id === currentUserId,
    };
  }
}
