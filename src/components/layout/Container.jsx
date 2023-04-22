import clsx from 'clsx'

export function Container({ className, ...props }) {
  return (
    <div
      className={clsx('max-w-screen-xl ', className)}
      {...props}
    />
  )
}
