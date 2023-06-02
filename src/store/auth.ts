import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

@Module({
  name: 'auth',
  stateFactory: true,
  namespaced: true,
  preserveState: true,
})
export default class Auth extends VuexModule {
  private userId: string = ''
  private displayName: string = ''
  private photoURL: string = ''

  public get getUserId() {
    return this.userId
  }

  public get getDisplayName() {
    return this.displayName
  }

  public get getPhotoURL() {
    return this.photoURL
  }

  @Mutation
  private setUserId(userId: string) {
    this.userId = userId
  }

  @Mutation
  private setDisplayName(displayName: string) {
    this.displayName = displayName
  }

  @Mutation
  private setPhotoURL(photoURL: string) {
    this.photoURL = photoURL
  }

  @Mutation
  private resetAuthInfo() {
    this.userId = ''
    this.displayName = ''
    this.photoURL = ''
  }

  @Action
  public updateUserId(userId: string) {
    this.setUserId(userId)
  }

  @Action
  public updateDisplayName(displayName: string) {
    this.setDisplayName(displayName)
  }

  @Action
  public updatePhotoURL(photoURL: string) {
    this.setPhotoURL(photoURL)
  }

  @Action
  public deleteAuthInfo() {
    this.resetAuthInfo()
  }
}
