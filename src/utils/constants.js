let apiRoot = ''
if (process.env.BUILD_MODE === 'dev') {
  apiRoot = 'http://localhost:8017'
}
if (process.env.BUILD_MODE === 'production') {
  apiRoot = 'https://trello-web-api-qh07.onrender.com'
}
export const API_ROOT = apiRoot

export const DEFAULT_PAGE = 1
export const DEFAULT_ITEMS_PER_PAGE = 12

export const CARD_MEMBERS_ACTIONS = {
  REMOVE: 'REMOVE',
  ADD: 'ADD'
}

// Preset màu cho Labels – giống Trello
export const LABEL_COLORS = [
  { id: 'green',  value: '#22c55e', name: 'Green' },
  { id: 'yellow', value: '#eab308', name: 'Yellow' },
  { id: 'orange', value: '#f97316', name: 'Orange' },
  { id: 'red',    value: '#ef4444', name: 'Red' },
  { id: 'purple', value: '#a855f7', name: 'Purple' },
  { id: 'blue',   value: '#3b82f6', name: 'Blue' },
  { id: 'sky',    value: '#0ea5e9', name: 'Sky' },
  { id: 'lime',   value: '#84cc16', name: 'Lime' },
  { id: 'pink',   value: '#ec4899', name: 'Pink' },
  { id: 'gray',   value: '#6b7280', name: 'Gray' }
]