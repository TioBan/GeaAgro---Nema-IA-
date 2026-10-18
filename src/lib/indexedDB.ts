import { ChatMessage } from '../types';

const DB_NAME = 'nema_ia_db';
const STORE_NAME = 'chat_messages';
const DB_VERSION = 1;

export function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB não é suportado neste ambiente.'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('Erro ao abrir IndexedDB:', event);
      reject(request.error);
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

export async function getStoredMessages(): Promise<ChatMessage[]> {
  try {
    const db = await initDB();
    return new Promise<ChatMessage[]>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const result = request.result || [];
        const messages = result.map((msg: any) => ({
          ...msg,
          timestamp: msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp),
        }));
        // Garantir ordenação temporal correta
        messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
        resolve(messages);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('Erro ao ler mensagens do IndexedDB:', error);
    return [];
  }
}

export async function saveStoredMessage(msg: ChatMessage): Promise<void> {
  try {
    const db = await initDB();
    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(msg);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('Erro ao salvar mensagem no IndexedDB:', error);
  }
}

export async function saveAllStoredMessages(messages: ChatMessage[]): Promise<void> {
  try {
    const db = await initDB();
    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      const clearRequest = store.clear();
      
      clearRequest.onsuccess = () => {
        if (messages.length === 0) {
          resolve();
          return;
        }

        let count = 0;
        let failed = false;

        messages.forEach((msg) => {
          const request = store.put(msg);
          request.onsuccess = () => {
            count++;
            if (count === messages.length && !failed) {
              resolve();
            }
          };
          request.onerror = () => {
            failed = true;
            reject(request.error);
          };
        });
      };

      clearRequest.onerror = () => {
        reject(clearRequest.error);
      };
    });
  } catch (error) {
    console.error('Erro ao salvar lote de mensagens no IndexedDB:', error);
  }
}

export async function clearStoredMessages(): Promise<void> {
  try {
    const db = await initDB();
    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('Erro ao limpar mensagens do IndexedDB:', error);
  }
}
