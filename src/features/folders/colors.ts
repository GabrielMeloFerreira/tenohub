export const FOLDER_COLORS = [
  'gray',
  'red',
  'orange',
  'amber',
  'green',
  'blue',
  'violet',
  'pink',
] as const

export type FolderColor = (typeof FOLDER_COLORS)[number]

export const folderColorClass: Record<string, string> = {
  gray: 'bg-gray-400',
  red: 'bg-red-500',
  orange: 'bg-orange-500',
  amber: 'bg-amber-500',
  green: 'bg-green-500',
  blue: 'bg-blue-500',
  violet: 'bg-violet-500',
  pink: 'bg-pink-500',
}

export function colorClass(color: string): string {
  return folderColorClass[color] ?? folderColorClass.gray
}
