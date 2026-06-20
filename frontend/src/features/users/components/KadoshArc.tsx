export const KadoshArc = () => {
  return (
    <svg
      className='absolute left-[10%] top-[16%]'
      width='490'
      height='490'
      viewBox='0 0 490 490'
      fill='none'
    >
      <circle cx='367' cy='34' r='10' fill='rgba(167,139,250,0.6)' filter='url(#glow)' />

      <circle
        cx='245'
        cy='245'
        r='244'
        stroke='url(#arcGradient)'
        strokeWidth='1'
      />

      <circle cx='367' cy='34' r='6' fill='rgba(124, 58, 237, 0.6)' />

      <defs>
        <filter id='glow' x='-200%' y='-200%' width='500%' height='500%'>
          <feGaussianBlur stdDeviation='7' result='blur' />
        </filter>
        <linearGradient id='arcGradient' x1='490' y1='0' x2='0' y2='490' gradientUnits='userSpaceOnUse'>
          <stop offset='0%' stopColor='rgba(167,139,250,0)' />
          <stop offset='25%' stopColor='rgba(124, 58, 237,0.25)' />
          <stop offset='40%' stopColor='rgba(124, 58, 237,0.08)' />
          <stop offset='55%' stopColor='rgba(167,139,250,0)' />
          <stop offset='100%' stopColor='rgba(167,139,250,0)' />
        </linearGradient>
      </defs>
    </svg>
  )
}
