import { getToken } from '@/utils/auth'

export function getHeaders() {
  return { Authorization: 'Bearer ' + getToken() }
}

export function getUploadUrl() {
  return process.env.VUE_APP_BASE_API + '/upload/uploadPicture'
}

