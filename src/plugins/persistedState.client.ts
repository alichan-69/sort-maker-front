import createPersistedState from 'vuex-persistedstate'
import type { Store } from 'vuex'

export default ({ store }: { store: Store<unknown> }) => {
  createPersistedState({
    key: 'auth',
    paths: ['auth'],
    storage: window.localStorage,
  })(store)
}
