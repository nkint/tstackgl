// NOTE: parcel will handle this for you

declare module '*.png' {}

declare module '*.svg' {}

declare module '*.css' {}

declare module '*.vert' {
  const content: string
  export default content
}

declare module '*.frag' {
  const content: string
  export default content
}
