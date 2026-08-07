export const useDate = (d: Date, end?: string) => {
  try {
    const date = new Intl.DateTimeFormat('ja-JP', {
      dateStyle: 'medium',
    }).format(d).replace(/\//g, '.');
    const weekday = new Intl.DateTimeFormat('ja-JP', {
      weekday: 'short'
    }).format(d);
    const time = new Intl.DateTimeFormat('ja-JP', {
      timeStyle: 'short',
      hour12: false
    }).format(d)

    return `${date} (${weekday}), ${time}${end ? " " + end : ""}`
  } catch (e) {
    throw new Error(`${e}`);
  }
}