import { useMediaQuery as useTMediaQuery } from '@vueuse/core'

const useMediaQuery = () => {
  const sm = useTMediaQuery('screen and (max-width:599px)')
  const tablet = useTMediaQuery(
    'screen and (min-width:600px) and ( max-width:1024px)'
  )
  const PC = useTMediaQuery('screen and (min-width:1025px)')

  return {
    sm,
    tablet,
    PC,
  }
}

export default useMediaQuery
