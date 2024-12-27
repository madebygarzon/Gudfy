let counter = 1;

export function generateTicketId() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const datePart = `${year}${month}${day}`;
  const randomNum = Math.floor(Math.random() * 100);
  const milliseconds = String(now.getMilliseconds()).slice(-1);
  const incrementalNum = String(counter).padStart(3, "0");
  counter++;
  const ticketId = `T${randomNum}${datePart}-${milliseconds}${incrementalNum}`;
  return ticketId;
}
