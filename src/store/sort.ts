import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import type { SortItem } from '@/utils/api/request'

@Module({
  name: 'sort',
  stateFactory: true,
  namespaced: true,
  preserveState: true,
})
export default class Sort extends VuexModule {
  private result: SortItem[] = []

  public get getResult() {
    return this.result
  }

  @Mutation
  private setResult(result: SortItem[]) {
    this.result = result
  }

  @Action
  public updateResult(result: SortItem[]) {
    this.setResult(result)
  }
}
