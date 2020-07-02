const {
  FETCH_DATA
} = require('../../lib/constants').default

export function fetchData(firebaseConfig) {
  return {
    type: FETCH_DATA,
    payload: firebaseConfig
  }
}