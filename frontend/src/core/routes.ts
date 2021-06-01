import { API } from "./index"

export const toggleClips = async (toggle: boolean): Promise<{ success: boolean, message: string }> => {
  return (await API.post(`toggleClips/`, { toggle })).data
}

export const playClip = async (clipId: string): Promise<{ success: boolean, message: string }> => {
  return (await API.post(`playClip/`, { clipId })).data
}

export const removeClip = async (clipId: string): Promise<{ success: boolean, message: string }> => {
  return (await API.post(`removeClip/`, { clipId })).data
}

export const nextClip = async (clipId: string): Promise<{ success: boolean, message: string }> => {
  return (await API.post(`nextClip/`, { clipId })).data
}