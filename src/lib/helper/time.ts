export function timeAgo(date: Date): string {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

    if (diffHours < 1) return 'Baru saja'
    if (diffHours < 24) return `${diffHours} jam yang lalu`

    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays} hari yang lalu`
}