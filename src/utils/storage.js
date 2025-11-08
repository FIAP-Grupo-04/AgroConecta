const PREFIX = "agroconecta_";

/**
 * Salva um valor JSON no localStorage
 * @param {string} key
 * @param {any} value
 */
export function saveData(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch (err) {
    console.error("Erro ao salvar no localStorage:", err);
  }
}

/**
 * Carrega um valor JSON do localStorage
 * @param {string} key
 * @param {any} fallback Valor retornado se não existir no localStorage
 * @returns {any}
 */
export function loadData(key, fallback = null) {
  try {
    const data = localStorage.getItem(PREFIX + key);
    return data ? JSON.parse(data) : fallback;
  } catch (err) {
    console.error("Erro ao carregar do localStorage:", err);
    return fallback;
  }
}

/**
 * Remove um item do localStorage
 * @param {string} key
 */
export function clearData(key) {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch (err) {
    console.error("Erro ao remover do localStorage:", err);
  }
}
