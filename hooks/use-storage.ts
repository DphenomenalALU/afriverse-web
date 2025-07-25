import { useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { v4 as uuidv4 } from 'uuid'

export const useStorage = () => {
  const supabase = createClient()

  const uploadListingImage = useCallback(async (file: File) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${uuidv4()}.${fileExt}`
    const filePath = `${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('listing-images')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('listing-images')
      .getPublicUrl(filePath)

    return publicUrl
  }, [])

  const uploadAvatar = useCallback(async (file: File, userId: string) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, { upsert: true })

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName)

    return publicUrl
  }, [])

  const deleteListingImage = useCallback(async (filePath: string) => {
    const { error } = await supabase.storage
      .from('listing-images')
      .remove([filePath])

    if (error) throw error
  }, [])

  const deleteAvatar = useCallback(async (userId: string) => {
    const { data } = await supabase.storage
      .from('avatars')
      .list('', {
        limit: 1,
        search: userId,
      })

    if (data && data.length > 0) {
      const { error } = await supabase.storage
        .from('avatars')
        .remove([data[0].name])

      if (error) throw error
    }
  }, [])

  return {
    uploadListingImage,
    uploadAvatar,
    deleteListingImage,
    deleteAvatar,
  }
} 