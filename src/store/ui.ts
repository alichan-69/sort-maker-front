import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

@Module({
  name: 'ui',
  stateFactory: true,
  namespaced: true,
  preserveState: true,
})
export default class Ui extends VuexModule {
  private loading: boolean = false

  public get getLoading() {
    return this.loading
  }

  @Mutation
  private setLoading(loading: boolean) {
    this.loading = loading
  }

  @Action
  public startLoading() {
    this.setLoading(true)
  }

  @Action
  public finishLoading() {
    this.setLoading(false)
  }
}
