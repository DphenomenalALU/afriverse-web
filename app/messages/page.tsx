"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import {
  Send,
  MoreVertical,
  Package,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  ArrowLeft,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

type MessageType = {
  id: string
  senderId: string
  content: string
  sent_at: string
  metadata?: any
}

type ConversationType = {
  id: string
  sellerId: string
  sellerName: string
  sellerAvatar: string | null
  sellerRating: number
  listingId: string
  listingTitle: string
  listingImage: string | null
  listingPrice: number
  lastMessage: string
  lastMessageTime: string
  status: "pending" | "accepted" | "payment_pending" | "payment_confirmed" | "completed"
  unread: boolean
}

const MessageBubble = ({ message }: { message: MessageType }) => {
  const isBuyer = message.senderId === "buyer"
  const isSystem = message.senderId === "system"

  if (isSystem) {
    return (
      <div className="flex justify-center my-2">
        <div className="rounded-full px-4 py-2 text-sm bg-gray-100 text-gray-600">
          {message.content}
        </div>
      </div>
    )
  }

  return (
    <div className={`flex ${isBuyer ? "justify-end" : "justify-start"} mb-4`}>
      {!isBuyer && (
        <Avatar className="h-8 w-8 mr-2">
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback>SM</AvatarFallback>
        </Avatar>
      )}
      <div
        className={`px-4 py-2 rounded-lg max-w-[70%] ${
          isBuyer ? "bg-primary text-white" : "bg-gray-100 text-gray-900"
        }`}
      >
        <p className="text-sm">{message.content}</p>
        <span className="text-xs opacity-70 mt-1 block">{new Date(message.sent_at).toLocaleString()}</span>
      </div>
      {isBuyer && (
        <Avatar className="h-8 w-8 ml-2">
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback>YO</AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}

export default function MessagesPage() {
  const router = useRouter()
  const supabase = createClient()
  const [selectedConversation, setSelectedConversation] = useState<ConversationType | null>(null)
  const [conversations, setConversations] = useState<ConversationType[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState<MessageType[]>([])
  const [showConversationList, setShowConversationList] = useState(true)
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [rating, setRating] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Load conversations
  useEffect(() => {
    const loadConversations = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          router.push('/auth/login')
          return
        }

        const userId = session.user.id

        // Get all purchases where the user is either buyer or seller
        const { data: purchases, error: purchasesError } = await supabase
          .from('purchases')
          .select(`
            *,
            listings (
              id,
              title,
              price,
              images,
              user_id
            ),
            profiles!profiles_user_id_fkey (
              id,
              name,
              avatar_url,
              rating
            )
          `)
          .or(`user_id.eq.${userId},listings.user_id.eq.${userId}`)
          .order('created_at', { ascending: false })

        if (purchasesError) throw purchasesError

        // Get the last message for each purchase
        const conversationsData = await Promise.all(purchases.map(async (purchase) => {
          const { data: lastMessage } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', purchase.id)
            .order('sent_at', { ascending: false })
            .limit(1)
            .single()

          const isBuyer = userId === purchase.user_id
          const seller = purchase.profiles
          const listing = purchase.listings

          return {
            id: purchase.id,
            sellerId: listing.user_id,
            sellerName: seller.name || 'Anonymous',
            sellerAvatar: seller.avatar_url,
            sellerRating: seller.rating,
            listingId: listing.id,
            listingTitle: listing.title,
            listingImage: listing.images?.[0] || null,
            listingPrice: listing.price,
            lastMessage: lastMessage?.content || 'No messages yet',
            lastMessageTime: lastMessage?.sent_at ? new Date(lastMessage.sent_at).toLocaleString() : 'Just now',
            status: purchase.status,
            unread: false // TODO: Implement unread status
          }
        }))

        setConversations(conversationsData)
        setIsLoading(false)

        // If URL has listing parameter, open that conversation
        const urlParams = new URLSearchParams(window.location.search)
        const listingId = urlParams.get('listing')
        if (listingId) {
          const conversation = conversationsData.find(c => c.listingId === listingId)
          if (conversation) {
            setSelectedConversation(conversation)
            setShowConversationList(false)
            loadMessages(conversation.id)
          }
        }
      } catch (error) {
        console.error('Error loading conversations:', error)
        setIsLoading(false)
      }
    }

    loadConversations()
  }, [])

  // Load messages for selected conversation
  const loadMessages = async (conversationId: string) => {
    try {
      const { data: messagesData, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('sent_at', { ascending: true })

      if (error) throw error
      setMessages(messagesData)
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }

  // Handle sending new message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { data: message, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: selectedConversation.id,
          sender_id: session.user.id,
          receiver_id: selectedConversation.sellerId,
          content: newMessage,
          sent_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      setMessages([...messages, message])
      setNewMessage("")
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  // Handle accepting offer
  const handleAcceptOffer = async () => {
    if (!selectedConversation) return

    try {
      const { error: updateError } = await supabase
        .from('purchases')
        .update({ status: 'accepted' })
        .eq('id', selectedConversation.id)

      if (updateError) throw updateError

      // Add system message
      const { data: message, error: messageError } = await supabase
        .from('messages')
        .insert({
          conversation_id: selectedConversation.id,
          sender_id: 'system',
          receiver_id: 'system',
          content: `Offer accepted at $${selectedConversation.listingPrice}. Buyer can now proceed to payment.`,
          sent_at: new Date().toISOString()
        })
        .select()
        .single()

      if (messageError) throw messageError

      setMessages([...messages, message])
      setSelectedConversation({
        ...selectedConversation,
        status: 'accepted'
      })
    } catch (error) {
      console.error('Error accepting offer:', error)
    }
  }

  // Handle payment confirmation
  const handlePaymentConfirmed = async () => {
    if (!selectedConversation) return

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      // Update purchase status
      const { error: updateError } = await supabase
        .from('purchases')
        .update({ 
          status: 'payment_pending',
          payment_status: 'paid'
        })
        .eq('id', selectedConversation.id)

      if (updateError) throw updateError

      // Add buyer message
      const { data: message, error: messageError } = await supabase
        .from('messages')
        .insert({
          conversation_id: selectedConversation.id,
          sender_id: session.user.id,
          receiver_id: selectedConversation.sellerId,
          content: "I've completed the payment.",
          sent_at: new Date().toISOString()
        })
        .select()
        .single()

      if (messageError) throw messageError

      setMessages([...messages, message])
      setSelectedConversation({
        ...selectedConversation,
        status: 'payment_pending'
      })
    } catch (error) {
      console.error('Error confirming payment:', error)
    }
  }

  // Handle seller confirming payment
  const handleSellerConfirmPayment = async () => {
    if (!selectedConversation) return

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      // Update purchase status
      const { error: updateError } = await supabase
        .from('purchases')
        .update({ 
          status: 'payment_confirmed',
          payment_status: 'confirmed'
        })
        .eq('id', selectedConversation.id)

      if (updateError) throw updateError

      // Add seller message
      const { data: message, error: messageError } = await supabase
        .from('messages')
        .insert({
          conversation_id: selectedConversation.id,
          sender_id: selectedConversation.sellerId,
          receiver_id: session.user.id,
          content: "Payment received! Thank you for your purchase.",
          sent_at: new Date().toISOString()
        })
        .select()
        .single()

      if (messageError) throw messageError

      setMessages([...messages, message])
      setSelectedConversation({
        ...selectedConversation,
        status: 'payment_confirmed'
      })
      setShowRatingModal(true)
    } catch (error) {
      console.error('Error confirming payment:', error)
    }
  }

  // Handle submitting rating
  const handleSubmitRating = async () => {
    if (!selectedConversation || !rating) return

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      // Update purchase with rating
      const { error: updateError } = await supabase
        .from('purchases')
        .update({ 
          status: 'completed',
          rating: rating,
          rating_submitted_at: new Date().toISOString()
        })
        .eq('id', selectedConversation.id)

      if (updateError) throw updateError

      // Add rating message
      const { data: message, error: messageError } = await supabase
        .from('messages')
        .insert({
          conversation_id: selectedConversation.id,
          sender_id: session.user.id,
          receiver_id: selectedConversation.sellerId,
          content: `Rated ${rating} stars`,
          sent_at: new Date().toISOString(),
          metadata: { rating }
        })
        .select()
        .single()

      if (messageError) throw messageError

      setMessages([...messages, message])
      setSelectedConversation({
        ...selectedConversation,
        status: 'completed'
      })
      setShowRatingModal(false)
    } catch (error) {
      console.error('Error submitting rating:', error)
    }
  }

  const getStatusColor = (status: ConversationType["status"]) => {
    switch (status) {
      case "pending":
        return "bg-gray-100 text-gray-800"
      case "accepted":
        return "bg-blue-100 text-blue-800"
      case "payment_pending":
        return "bg-yellow-100 text-yellow-800"
      case "payment_confirmed":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: ConversationType["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "accepted":
        return <CheckCircle className="h-4 w-4" />
      case "payment_pending":
        return <DollarSign className="h-4 w-4" />
      case "payment_confirmed":
        return <Shield className="h-4 w-4" />
      case "completed":
        return <Package className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />

      <div className="container max-w-7xl mx-auto py-4 md:py-8 px-4 sm:px-6">
        <div className="mb-4 md:mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Messages</h1>
          <p className="text-gray-600">Chat with sellers and complete your purchases</p>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          {showConversationList ? (
            /* Conversations List - Mobile */
            <Card className="h-[calc(100vh-240px)] flex flex-col">
              <CardHeader className="border-b pb-4">
                <CardTitle className="text-lg">Conversations</CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex-1 overflow-y-auto">
                <div className="divide-y divide-gray-100">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => {
                        setSelectedConversation(conversation)
                        setShowConversationList(false)
                      }}
                      className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10 shrink-0">
                          <AvatarImage src={conversation.sellerAvatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {conversation.sellerName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <h4 className="font-medium text-gray-900 truncate">{conversation.sellerName}</h4>
                            <span className="text-xs text-gray-500 whitespace-nowrap">{conversation.lastMessageTime}</span>
                          </div>

                          <div className="flex items-center gap-2 mb-2">
                            <Badge 
                              className={`text-xs px-2 py-0.5 ${getStatusColor(conversation.status)}`}
                              variant="secondary"
                            >
                              {getStatusIcon(conversation.status)}
                              <span className="ml-1 capitalize">{conversation.status.replace("_", " ")}</span>
                            </Badge>
                          </div>

                          <div className="flex items-start gap-2 mb-2">
                            <div className="relative w-12 h-12 rounded-md overflow-hidden shrink-0">
                            <Image
                              src={conversation.listingImage || "/placeholder.svg"}
                              alt={conversation.listingTitle}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <h5 className="text-sm font-medium text-gray-900 truncate">{conversation.listingTitle}</h5>
                              <p className="text-sm font-semibold text-primary">${conversation.listingPrice}</p>
                            </div>
                          </div>

                          <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Chat View - Mobile */
            <div className="h-[calc(100vh-240px)] flex flex-col">
              <div className="flex items-center gap-3 mb-4 p-2 bg-white rounded-lg shadow-sm">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowConversationList(true)}
                  className="shrink-0"
                >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                <div className="flex items-center gap-2 min-w-0">
                  <Avatar className="h-8 w-8 shrink-0">
                      <AvatarImage src={selectedConversation?.sellerAvatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {selectedConversation?.sellerName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  <div className="min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{selectedConversation?.sellerName}</h4>
                    <Badge 
                      className={`text-xs px-2 py-0.5 ${getStatusColor(selectedConversation?.status || "pending")}`}
                      variant="secondary"
                    >
                          {getStatusIcon(selectedConversation?.status || "pending")}
                          <span className="ml-1 capitalize">{selectedConversation?.status.replace("_", " ")}</span>
                        </Badge>
                  </div>
                </div>
              </div>

              <Card className="flex-1 flex flex-col">
                <CardContent className="p-4 flex-1 overflow-y-auto">
                <div className="space-y-4">
                  {messages.map((message) => (
                      <MessageBubble key={message.id} message={message} />
                  ))}
                </div>
              </CardContent>

                <div className="border-t p-4 space-y-4">
                  {/* Chat Actions */}
                  {selectedConversation?.status === "pending" && (
                    <Button
                      onClick={handleAcceptOffer}
                      className="w-full bg-primary text-white hover:bg-primary/90"
                    >
                      Accept Offer at ${selectedConversation?.listingPrice}
                    </Button>
                  )}

                  {selectedConversation?.status === "accepted" && (
                    <Button
                      onClick={handlePaymentConfirmed}
                      className="w-full bg-primary text-white hover:bg-primary/90"
                    >
                      I've Completed Payment
                    </Button>
                  )}

                  {selectedConversation?.status === "payment_pending" && selectedConversation?.sellerId === "sarah_m" && (
                    <Button
                      onClick={handleSellerConfirmPayment}
                      className="w-full bg-green-600 text-white hover:bg-green-700"
                    >
                      Confirm Payment Received
                    </Button>
                )}

                  {/* Message Input */}
                  <div className="flex items-center gap-2">
                  <Input
                      placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1"
                  />
                    <Button
                      size="icon"
                      onClick={handleSendMessage}
                      className="bg-primary text-white hover:bg-primary/90 shrink-0"
                    >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                </div>
              </Card>
              </div>
          )}
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid grid-cols-12 gap-6 h-[calc(100vh-240px)]">
          {/* Conversations List - Desktop */}
          <Card className="col-span-4 flex flex-col">
            <CardHeader className="border-b pb-4">
                <CardTitle className="text-lg">Conversations</CardTitle>
              </CardHeader>
            <CardContent className="p-0 flex-1 overflow-y-auto">
              <div className="divide-y divide-gray-100">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedConversation?.id === conversation.id ? "bg-gray-50" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10 shrink-0">
                          <AvatarImage src={conversation.sellerAvatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {conversation.sellerName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                            <h4 className="font-medium text-gray-900 truncate">{conversation.sellerName}</h4>
                          <span className="text-xs text-gray-500 whitespace-nowrap">{conversation.lastMessageTime}</span>
                          </div>

                          <div className="flex items-center gap-2 mb-2">
                          <Badge 
                            className={`text-xs px-2 py-0.5 ${getStatusColor(conversation.status)}`}
                            variant="secondary"
                          >
                              {getStatusIcon(conversation.status)}
                              <span className="ml-1 capitalize">{conversation.status.replace("_", " ")}</span>
                            </Badge>
                          </div>

                        <div className="flex items-start gap-2 mb-2">
                          <div className="relative w-12 h-12 rounded-md overflow-hidden shrink-0">
                            <Image
                              src={conversation.listingImage || "/placeholder.svg"}
                              alt={conversation.listingTitle}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <h5 className="text-sm font-medium text-gray-900 truncate">{conversation.listingTitle}</h5>
                            <p className="text-sm font-semibold text-primary">${conversation.listingPrice}</p>
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

          {/* Chat View - Desktop */}
          <Card className="col-span-8 flex flex-col">
            <CardHeader className="border-b pb-4">
                  <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 shrink-0">
                      <AvatarImage src={selectedConversation?.sellerAvatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {selectedConversation?.sellerName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                <div className="min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">{selectedConversation?.sellerName}</h4>
                  <Badge 
                    className={`text-xs px-2 py-0.5 ${getStatusColor(selectedConversation?.status || "pending")}`}
                    variant="secondary"
                  >
                          {getStatusIcon(selectedConversation?.status || "pending")}
                          <span className="ml-1 capitalize">{selectedConversation?.status.replace("_", " ")}</span>
                        </Badge>
                  </div>
                </div>
              </CardHeader>

            <CardContent className="p-4 flex-1 overflow-y-auto">
                <div className="space-y-4">
                  {messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
                          </div>
            </CardContent>

            <div className="border-t p-4 space-y-4">
              {/* Chat Actions */}
              {selectedConversation?.status === "pending" && (
                <Button
                  onClick={handleAcceptOffer}
                  className="w-full bg-primary text-white hover:bg-primary/90"
                >
                  Accept Offer at ${selectedConversation?.listingPrice}
                </Button>
              )}

              {selectedConversation?.status === "accepted" && (
                                <Button
                  onClick={handlePaymentConfirmed}
                  className="w-full bg-primary text-white hover:bg-primary/90"
                                >
                  I've Completed Payment
                                </Button>
              )}

              {selectedConversation?.status === "payment_pending" && selectedConversation?.sellerId === "sarah_m" && (
                                <Button
                  onClick={handleSellerConfirmPayment}
                  className="w-full bg-green-600 text-white hover:bg-green-700"
                >
                  Confirm Payment Received
                                </Button>
              )}

              {/* Message Input */}
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1"
                />
                <Button
                  size="icon"
                  onClick={handleSendMessage}
                  className="bg-primary text-white hover:bg-primary/90 shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
                          </div>
                        </div>
          </Card>
                    </div>

        {/* Rating Modal */}
        {showRatingModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full mx-auto">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">Rate Your Experience</h3>
                <p className="text-gray-600 mb-6">
                  How would you rate your experience with {selectedConversation?.sellerName}?
                </p>
                
                <div className="flex justify-center gap-3 mb-8">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`text-3xl transition-colors ${
                        star <= rating ? "text-yellow-400" : "text-gray-300"
                      } hover:text-yellow-400`}
                    >
                      ★
                    </button>
                  ))}
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowRatingModal(false)}
                  >
                    Cancel
                    </Button>
                    <Button
                    onClick={handleSubmitRating}
                    disabled={rating === 0}
                    className="bg-primary text-white hover:bg-primary/90"
                  >
                    Submit Rating
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <SiteFooter />
    </div>
  )
}
