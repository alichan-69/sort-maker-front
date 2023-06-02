export type Click = () => void
export type InputText = (value: string) => void
export type ClickOutsideDialog = Click | Promise<void>
export type ClickIconButton = Click | Promise<void>
