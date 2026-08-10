export const useDate = (d?: Date | string | number | null, end?: string) => {
  if (!d) return '';
  const dateObj = typeof d === 'string' || typeof d === 'number' ? new Date(d) : d;
  if (isNaN(dateObj.getTime())) return '';
  try {
    const date = new Intl.DateTimeFormat('ja-JP', {
      dateStyle: 'medium',
    }).format(dateObj).replace(/\//g, '.');
    const weekday = new Intl.DateTimeFormat('ja-JP', {
      weekday: 'short'
    }).format(dateObj);
    const time = new Intl.DateTimeFormat('ja-JP', {
      timeStyle: 'short',
      hour12: false
    }).format(dateObj);

    return `${date} (${weekday}), ${time}${end ? " " + end : ""}`;
  } catch (e) {
    return '';
  }
};