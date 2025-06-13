const STACK_AI_URL = import.meta.env.VITE_STACK_AI_API_URL; // URL from .env file
const STACK_AI_KEY = import.meta.env.VITE_STACK_AI_API_KEY; // API Key from .env file

if (!STACK_AI_URL || !STACK_AI_KEY) {
  console.warn('Stack AI configuration is not complete. Please check your environment variables.');
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export const sendMessage = async (message: string): Promise<string> => {
  try {
    if (!STACK_AI_URL || !STACK_AI_KEY) {
      throw new Error('La configuración de Stack AI no está completa');
    }

    const response = await fetch(STACK_AI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STACK_AI_KEY}`
      },
      body: JSON.stringify({
        "in-1": message
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Error al obtener respuesta del asistente');
    }

    const data = await response.json();
    return data.outputs?.['out-0'] || data.response || 'Lo siento, no pude procesar tu consulta.';
  } catch (error) {
    console.error('Error en chatService:', error);
    throw error;
  }
};

export const sendMessageWithAuth = async (message: string): Promise<string> => {
  return sendMessage(message);
};
