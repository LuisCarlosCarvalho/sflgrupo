export function formatWhatsAppUrl(planName: string, userName?: string, userEmail?: string) {
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "351928485483";
  let message = `Olá! Tenho interesse nos serviços da SFL Grupo e gostaria de tirar algumas dúvidas antes de avançar. Podem me orientar?`;
  
  if (userName && userEmail) {
    message = `Olá! Meu nome é ${userName} (${userEmail}). Tenho interesse nos serviços da SFL Grupo e gostaria de tirar algumas dúvidas antes de avançar. Podem me orientar?`;
  }
  
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}
