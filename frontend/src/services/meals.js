const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api'

export async function getMealRecords() {
  const response = await fetch(`${API_URL}/meals/`)
  if (!response.ok) throw new Error('식사 기록을 불러오지 못했어요.')
  return response.json()
}
export async function createMealRecord(payload) {
  const response = await fetch(`${API_URL}/meals/`, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload)})
  if (!response.ok) { const error = await response.json(); throw new Error(Object.values(error).flat().join(' ') || '식사 기록을 저장하지 못했어요.') }
  return response.json()
}

export async function saveConditionRecord(mealId, payload) {
  const response = await fetch(`${API_URL}/meals/${mealId}/condition/`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload) })
  if (!response.ok) throw new Error('식후 상태를 저장하지 못했어요.')
  return response.json()
}

export async function getInsights() {
  const response = await fetch(`${API_URL}/insights/`)
  if (!response.ok) throw new Error('패턴 분석을 불러오지 못했어요.')
  return response.json()
}

export async function createScheduleGuide(payload) {
  const response = await fetch(`${API_URL}/guides/`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload) })
  if (!response.ok) throw new Error('식사 가이드를 만들지 못했어요.')
  return response.json()
}
