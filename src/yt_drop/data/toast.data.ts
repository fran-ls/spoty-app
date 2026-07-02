export const toastVariant = {
  del: {
    title: 'Eliminar archivo',
    msg: 'Se eliminará permanentemente. Esta acción no se puede deshacer.',
    confirmText: 'Sí, eliminar',
    icon: `<path d="M3 5h11M8 5V3h1v2M6 5v8h5V5H6zm1 2v4m2-4v4" stroke="#A32D2D" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>`,
    fbSuccess: {
      title: 'Archivo eliminado',
      sub: 'El archivo fue eliminado correctamente.',
      icon: `<path d="M4 10l4 4 8-8" stroke="#3B6D11" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="30" stroke-dashoffset="30" style="animation:checkDraw 0.4s ease 0.05s forwards"/>`,
      iconClass: 'success'
    }
  },
  info: {
    title: 'Enviar mensaje',
    msg: '¿Confirmas el envío a todos los destinatarios?',
    confirmText: 'Sí, enviar',
    icon: `<path d="M2 3l13 5-13 5V9.5l9-1.5-9-1.5V3z" stroke="#185FA5" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>`,
    fbSuccess: {
      title: 'Mensaje enviado',
      sub: 'Fue enviado a todos los destinatarios.',
      icon: `<path d="M4 10l4 4 8-8" stroke="#3B6D11" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="30" stroke-dashoffset="30" style="animation:checkDraw 0.4s ease 0.05s forwards"/>`,
      iconClass: 'success'
    }
  },
  save: {
    title: 'Guardar cambios',
    msg: 'Se sobrescribirá la versión anterior del documento.',
    confirmText: 'Guardar',
    icon: `<path d="M3 3h9l2 2v9H3V3zm3 0v4h5V3M5 13v-4h7v4" stroke="#3B6D11" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>`,
    fbSuccess: {
      title: 'Cambios guardados',
      sub: 'El documento fue actualizado correctamente.',
      icon: `<path d="M4 10l4 4 8-8" stroke="#3B6D11" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="30" stroke-dashoffset="30" style="animation:checkDraw 0.4s ease 0.05s forwards"/>`,
      iconClass: 'success'
    }
  },
  warn: {
    title: 'Cerrar sesión',
    msg: 'Perderás cualquier progreso no guardado.',
    confirmText: 'Cerrar sesión',
    icon: `<path d="M10 3H4v11h6M11 6l3 3-3 3M7 9h7" stroke="#854F0B" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>`,
    fbSuccess: {
      title: 'Sesión cerrada',
      sub: 'Has salido de tu cuenta correctamente.',
      icon: `<path d="M4 10l4 4 8-8" stroke="#3B6D11" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="30" stroke-dashoffset="30" style="animation:checkDraw 0.4s ease 0.05s forwards"/>`,
      iconClass: 'success'
    }
  }
}