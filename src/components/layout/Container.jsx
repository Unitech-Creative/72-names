import clsx from 'clsx'

export function Container({ className, ...props }) {
  return (
    <div className={clsx('max-w-screen-xl ', className)}>
      <div className="rounded-lg border border-cal-700 mx-2 lg:mx-0 p-3 md:p-4 pt-5">
        {props.children}
      </div>
    </div>
  )
}
