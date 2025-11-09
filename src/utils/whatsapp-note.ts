const NOTE_TEMPLATE = (
  amount: string
): string => `📌 Note:
Total cost RS ${amount}/- with delivery and frame free.
Only embosses from upper sides.

Delivery In Karachi 03 to 04 WORKING   Days.
Delivery out of Karachi 06 to 07 WORKING   Days.

Kindly check detail and confirm your order.`;

const resolveAmount = (price: string | null): string =>
  price && price.trim().length > 0 ? price.trim() : '____';

export const buildWhatsappNote = (price: string | null): string => NOTE_TEMPLATE(resolveAmount(price));

