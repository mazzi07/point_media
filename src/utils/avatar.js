// O backend aplica os mesmos limites ao conteúdo decodificado do data URL.
export const AVATAR_ACCEPT = 'image/jpeg,image/png';
export const MAX_AVATAR_BYTES = 1024 * 1024;

export function validateAvatarFile(file) {
  if (!['image/jpeg', 'image/png'].includes(file.type)) {
    return 'Escolha uma imagem JPEG ou PNG.';
  }
  if (file.size === 0 || file.size > MAX_AVATAR_BYTES) {
    return 'A imagem deve ter conteúdo e no máximo 1 MiB (1.048.576 bytes).';
  }
  return null;
}
