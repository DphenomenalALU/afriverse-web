import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/types'

type Message = Database['public']['Tables']['messages']['Row']
type MessageInsert = Database['public']['Tables']['messages']['Insert']

export const useMessages = (userId: string) => {
  const supabase = createClient()
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    // Subscribe to new messages
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=eq.${userId},receiver_id=eq.${userId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message
          setMessages((prev) => [...prev, newMessage])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  const sendMessage = useCallback(async (receiverId: string, content: string) => {
    const messageData: MessageInsert = {
      sender_id: userId,
      receiver_id: receiverId,
      content,
    }

    const { data, error } = await supabase
      .from('messages')
      .insert([messageData])
      .select()
      .single()

    if (error) throw error
    return data
  }, [userId])

  const fetchMessages = useCallback(async (otherUserId: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`)
      .order('sent_at', { ascending: true })

    if (error) throw error
    setMessages(data)
    return data
  }, [userId])

  const fetchConversations = useCallback(async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('sent_at', { ascending: false })

    if (error) throw error

    // Group messages by conversation
    const conversations = data.reduce((acc, message) => {
      const otherUserId = message.sender_id === userId ? message.receiver_id : message.sender_id
      if (!acc[otherUserId]) {
        acc[otherUserId] = {
          otherUserId,
          lastMessage: message,
          messages: [message],
        }
      } else {
        acc[otherUserId].messages.push(message)
      }
      return acc
    }, {} as Record<string, { otherUserId: string; lastMessage: Message; messages: Message[] }>)

    return Object.values(conversations)
  }, [userId])

  return {
    messages,
    sendMessage,
    fetchMessages,
    fetchConversations,
  }
} 