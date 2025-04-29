// export function formatDate(dateString: string): string {
//   const date = new Date(dateString);
//   const day = date.getDate().toString().padStart(2, "0");
//   const month = date.toLocaleString("en-US", { month: "short" });
//   const year = date.getFullYear();

//   return `${day} ${month} ${year}`;
// }

// utils/format-date.ts
export function formatDate(
  dateString: string,
  options?: { showTime?: boolean }
): string {
  if (!dateString) return "";

  const { showTime = true } = options ?? {};
  const date = new Date(dateString);

  // Parte de fecha -> 26 Apr 2025
  const day   = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" }); // Apr
  const year  = date.getFullYear();

  // Parte de hora -> 18:42:15 (24 h)
  const time = date.toLocaleTimeString("es-CO", {
    hour12: false,
    hour:   "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return showTime ? `${day} ${month} ${year} ${time}` : `${day} ${month} ${year}`;
}
