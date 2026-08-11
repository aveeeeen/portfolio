export const useDate = (d?: Date | string | number | null, end?: string) => {
  if (!d) return '';
  const dateObj = typeof d === 'string' || typeof d === 'number' ? new Date(d) : d;
  if (isNaN(dateObj.getTime())) return '';
  try {
    const timeZone = 'Asia/Tokyo';
    const date = new Intl.DateTimeFormat('ja-JP', {
      dateStyle: 'medium',
      timeZone,
    }).format(dateObj).replace(/\//g, '.');
    const weekday = new Intl.DateTimeFormat('ja-JP', {
      weekday: 'short',
      timeZone,
    }).format(dateObj);
    const time = new Intl.DateTimeFormat('ja-JP', {
      timeStyle: 'short',
      hour12: false,
      timeZone,
    }).format(dateObj);

    return `${date} (${weekday}), ${time}${end ? " " + end : ""}`;
  } catch (e) {
    return '';
  }
};