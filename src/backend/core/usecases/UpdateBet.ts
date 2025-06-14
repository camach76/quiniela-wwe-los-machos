import { BetRepository } from "../domain/repositories/BetRepository";

export type UpdateBetInput = {
  betId: string;
  prediccionA: number | null;
  prediccionB: number | null;
};

export class UpdateBet {
  constructor(private betRepo: BetRepository) {}

  async execute(input: UpdateBetInput) {
    const { betId, prediccionA, prediccionB } = input;

    // Validar que al menos un pronóstico tenga valor
    if (prediccionA === null && prediccionB === null) {
      throw new Error('Al menos un pronóstico es requerido');
    }

    // Validar que los pronósticos sean números enteros no negativos
    if ((prediccionA !== null && (!Number.isInteger(prediccionA) || prediccionA < 0)) ||
        (prediccionB !== null && (!Number.isInteger(prediccionB) || prediccionB < 0))) {
      throw new Error('Los pronósticos deben ser números enteros no negativos');
    }

    // Actualizar el pronóstico
    const updatedBet = await this.betRepo.update({
      id: betId,
      prediccionA,
      prediccionB
    });

    return updatedBet;
  }
}
