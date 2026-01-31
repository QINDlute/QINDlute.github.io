// .vitepress/theme/composables/types.ts
export interface navItem {
  id: string | number
  text: string
  desc?: string
  link: string
  icon?: string
}

export interface menuItem {
  id: string | number
  name: string
  url: string
  image: string
}