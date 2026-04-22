export function formatWhatsAppUrl(planName: string, userName?: string, userEmail?: string) {
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "351928485483";
  let message = `Olá, quero assinar o plano *${planName.toUpperCase()}* no SFL Stream.`;
  
  if (userName && userEmail) {
    message = `Olá! Meu nome é ${userName} (${userEmail}). Quero assinar o plano *${planName.toUpperCase()}* no SFL Stream.`;
  }
  
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}
