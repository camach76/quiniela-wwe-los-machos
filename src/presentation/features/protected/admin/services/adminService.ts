"use client";

import { supabase } from '@/presentation/utils/supabase/client'

export type MatchAdmin = {
  id: number
  fecha: string
  estadio: string
  grupo: string | null
  resultado_a: number | null
  resultado_b: number | null
  club_a_id: number
  club_b_id: number
  club_a: { id: number; nombre: string; logo_url: string }
  club_b: { id: number; nombre: string; logo_url: string }
}

export type AdminProfile = {
  id: string
  username: string
  email: string
  puntos: number | null
  aciertos: number | null
  total_apostados: number | null
  precision: number | null
  racha: number | null
  role: string
  created_at: string
}

export type ClubOption = {
  id: number
  nombre: string
  logo_url: string
  pais: string
}

function calcPoints(predA: number, predB: number, resA: number, resB: number): number {
  if (predA === resA && predB === resB) return 3
  const predWinner = predA > predB ? 'A' : predA < predB ? 'B' : 'D'
  const realWinner = resA > resB ? 'A' : resA < resB ? 'B' : 'D'
  return predWinner === realWinner ? 1 : 0
}

export const adminService = {
  async getMatches(): Promise<MatchAdmin[]> {
    const { data, error } = await supabase
      .from('matches')
      .select('*, club_a:club_a_id(*), club_b:club_b_id(*)')
      .order('fecha', { ascending: true })
    if (error) throw error
    return data as MatchAdmin[]
  },

  async getClubs(): Promise<ClubOption[]> {
    const { data, error } = await supabase
      .from('clubs')
      .select('*')
      .order('nombre')
    if (error) throw error
    return data as ClubOption[]
  },

  async createMatch(input: { club_a_id: number; club_b_id: number; fecha: string; estadio: string; grupo: string }) {
    const { error } = await supabase.from('matches').insert([input])
    if (error) throw error
  },

  async updateMatch(id: number, input: { club_a_id: number; club_b_id: number; fecha: string; estadio: string; grupo: string }) {
    const { error } = await supabase.from('matches').update(input).eq('id', id)
    if (error) throw error
  },

  async deleteMatch(id: number) {
    const { error: betsError } = await supabase.from('bets').delete().eq('match_id', id)
    if (betsError) throw betsError
    const { error } = await supabase.from('matches').delete().eq('id', id)
    if (error) throw error
  },

  async setResult(matchId: number, resA: number, resB: number) {
    const { data: match } = await supabase
      .from('matches')
      .select('resultado_a, resultado_b')
      .eq('id', matchId)
      .single()

    const isFirstTime = match?.resultado_a === null

    const { data: bets, error: betsError } = await supabase
      .from('bets')
      .select('*')
      .eq('match_id', matchId)
    if (betsError) throw betsError

    for (const bet of bets ?? []) {
      const oldPoints = isFirstTime ? 0 : (bet.puntos_obtenidos ?? 0)
      const newPoints = calcPoints(bet.prediccion_a, bet.prediccion_b, resA, resB)

      const { data: profile } = await supabase
        .from('profiles')
        .select('puntos, aciertos, total_apostados')
        .eq('id', bet.user_id)
        .single()

      if (profile) {
        const wasCorrect = !isFirstTime && oldPoints > 0
        const isCorrect = newPoints > 0

        const newPuntos = Math.max(0, (profile.puntos ?? 0) - oldPoints + newPoints)
        let newAciertos = profile.aciertos ?? 0
        if (wasCorrect) newAciertos = Math.max(0, newAciertos - 1)
        if (isCorrect) newAciertos++

        const newTotal = isFirstTime
          ? (profile.total_apostados ?? 0) + 1
          : (profile.total_apostados ?? 0)

        // precision is GENERATED ALWAYS AS in Postgres — never include it in updates
        await supabase.from('profiles').update({
          puntos: newPuntos,
          aciertos: newAciertos,
          total_apostados: newTotal,
        }).eq('id', bet.user_id)
      }

      await supabase.from('bets').update({ puntos_obtenidos: newPoints }).eq('id', bet.id)
    }

    const { error } = await supabase
      .from('matches')
      .update({ resultado_a: resA, resultado_b: resB })
      .eq('id', matchId)
    if (error) throw error
  },

  async getUsers(): Promise<AdminProfile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('puntos', { ascending: false })
    if (error) throw error
    return data as AdminProfile[]
  },

  async updateUserRole(userId: string, role: 'user' | 'admin') {
    const { error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId)
    if (error) throw error
  },
}
