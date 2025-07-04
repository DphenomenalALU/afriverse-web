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

// Mock conversation data
const mockConversations = [
  {
    id: 1,
    sellerId: "sarah_m",
    sellerName: "Sarah M.",
    sellerAvatar: "/placeholder.svg?height=40&width=40",
    sellerRating: 4.8,
    itemId: 1,
    itemTitle: "Vintage Levi's Denim Jacket",
    itemImage: "/placeholder.svg?height=80&width=80",
    itemPrice: 45,
    lastMessage: "Great! I can do $40. When would you like to complete the purchase?",
    lastMessageTime: "2 min ago",
    status: "negotiating", // negotiating, payment_pending, confirmed, shipped, completed
    unread: true,
  },
  {
    id: 2,
    sellerId: "amara_k",
    sellerName: "Amara K.",
    sellerAvatar: "/placeholder.svg?height=40&width=40",
    sellerRating: 4.9,
    itemId: 2,
    itemTitle: "Floral Summer Dress",
    itemImage: "/placeholder.svg?height=80&width=80",
    itemPrice: 25,
    lastMessage: "Payment confirmed! I'll ship this out tomorrow.",
    lastMessageTime: "1 hour ago",
    status: "confirmed",
    unread: false,
  },
]

const mockMessages = [
  {
    id: 1,
    senderId: "buyer",
    message: "Hi! I'm interested in the Vintage Levi's Denim Jacket. Would you consider $40?",
    timestamp: "10:30 AM",
    type: "text",
  },
  {
    id: 2,
    senderId: "sarah_m",
    message: "Hello! Thanks for your interest. The jacket is in excellent condition. I could do $42?",
    timestamp: "10:35 AM",
    type: "text",
  },
  {
    id: 3,
    senderId: "buyer",
    message: "That works for me! How do we proceed with payment?",
    timestamp: "10:37 AM",
    type: "text",
  },
  {
    id: 4,
    senderId: "sarah_m",
    message: "Great! I can do $40. When would you like to complete the purchase?",
    timestamp: "10:40 AM",
    type: "text",
  },
  {
    id: 5,
    senderId: "system",
    message: "Offer received: $40 for Vintage Levi's Denim Jacket",
    timestamp: "10:40 AM",
    type: "offer",
    offerAmount: 40,
    originalPrice: 45,
  },
]

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0])
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState(mockMessages)
  const [showConversationList, setShowConversationList] = useState(true)

  // Get URL params for direct item context
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const itemId = urlParams.get("item")
    const action = urlParams.get("action")

    if (itemId && action === "buy") {
      // Auto-open conversation for specific item
      const conversation = mockConversations.find((c) => c.itemId === Number.parseInt(itemId))
      if (conversation) {
        setSelectedConversation(conversation)
        setShowConversationList(false)
      }
    }
  }, [])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message = {
      id: messages.length + 1,
      senderId: "buyer",
      message: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "text" as const,
    }

    setMessages([...messages, message])
    setNewMessage("")
  }

  const handleAcceptOffer = (amount: number) => {
    const message = {
      id: messages.length + 1,
      senderId: "system",
      message: `Offer accepted: $${amount}. Proceeding to secure payment.`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "system" as const,
    }
    setMessages([...messages, message])
  }

  const handleCounterOffer = (amount: number) => {
    const message = {
      id: messages.length + 1,
      senderId: "buyer",
      message: `Counter offer: $${amount}`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "offer" as const,
      offerAmount: amount,
      originalPrice: selectedConversation.itemPrice,
    }
    setMessages([...messages, message])
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "negotiating":
        return "bg-yellow-100 text-yellow-800"
      case "payment_pending":
        return "bg-blue-100 text-blue-800"
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "negotiating":
        return <DollarSign className="h-4 w-4" />
      case "payment_pending":
        return <Clock className="h-4 w-4" />
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />
      case "shipped":
        return <Package className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />

      <div className="container py-4 md:py-8 px-4">
        <div className="mb-4 md:mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Messages</h1>
          <p className="text-gray-600">Negotiate prices and confirm purchases with sellers</p>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          {showConversationList ? (
            /* Conversations List - Mobile */
            <Card className="h-[calc(100vh-200px)]">
              <CardHeader>
                <CardTitle className="text-lg">Conversations</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {mockConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => {
                        setSelectedConversation(conversation)
                        setShowConversationList(false)
                      }}
                      className="p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-100"
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={conversation.sellerAvatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {conversation.sellerName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-gray-900 truncate">{conversation.sellerName}</h4>
                            <span className="text-xs text-gray-500">{conversation.lastMessageTime}</span>
                          </div>

                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={`text-xs ${getStatusColor(conversation.status)}`}>
                              {getStatusIcon(conversation.status)}
                              <span className="ml-1 capitalize">{conversation.status.replace("_", " ")}</span>
                            </Badge>
                          </div>

                          <div className="flex items-center gap-2 mb-2">
                            <Image
                              src={conversation.itemImage || "/placeholder.svg"}
                              alt={conversation.itemTitle}
                              width={24}
                              height={24}
                              className="rounded object-cover"
                            />
                            <span className="text-sm text-gray-600 truncate">{conversation.itemTitle}</span>
                          </div>

                          <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>

                          {conversation.unread && <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Chat Area - Mobile */
            <Card className="h-[calc(100vh-200px)] flex flex-col">
              {/* Chat Header */}
              <CardHeader className="border-b border-gray-200 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" onClick={() => setShowConversationList(true)} className="p-1">
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={selectedConversation.sellerAvatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {selectedConversation.sellerName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">{selectedConversation.sellerName}</h3>
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs ${getStatusColor(selectedConversation.status)}`}>
                          {getStatusIcon(selectedConversation.status)}
                          <span className="ml-1 capitalize">{selectedConversation.status.replace("_", " ")}</span>
                        </Badge>
                        <span className="text-xs text-gray-500">★ {selectedConversation.sellerRating}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>

                {/* Item Context */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mt-3">
                  <Image
                    src={selectedConversation.itemImage || "/placeholder.svg"}
                    alt={selectedConversation.itemTitle}
                    width={40}
                    height={40}
                    className="rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">{selectedConversation.itemTitle}</h4>
                    <p className="text-sm font-bold text-green-600">${selectedConversation.itemPrice}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Shield className="h-3 w-3" />
                    Protected
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id}>
                      {message.type === "system" && (
                        <div className="text-center">
                          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                            <Shield className="h-3 w-3" />
                            {message.message}
                          </div>
                        </div>
                      )}

                      {message.type === "offer" && (
                        <div className="flex justify-center">
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-sm">
                            <div className="text-center mb-3">
                              <div className="text-sm text-gray-600 mb-1">Price Offer</div>
                              <div className="text-2xl font-bold text-green-600">${message.offerAmount}</div>
                              {message.originalPrice && (
                                <div className="text-sm text-gray-500">
                                  Original: <span className="line-through">${message.originalPrice}</span>
                                </div>
                              )}
                            </div>

                            {message.senderId !== "buyer" && (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleAcceptOffer(message.offerAmount!)}
                                  className="flex-1 bg-green-600 hover:bg-green-700"
                                >
                                  Accept
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleCounterOffer(message.offerAmount! - 5)}
                                  className="flex-1"
                                >
                                  Counter
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {message.type === "text" && (
                        <div className={`flex ${message.senderId === "buyer" ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`max-w-xs px-4 py-2 rounded-lg ${
                              message.senderId === "buyer" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                            }`}
                          >
                            <p className="text-sm">{message.message}</p>
                            <p
                              className={`text-xs mt-1 ${
                                message.senderId === "buyer" ? "text-blue-100" : "text-gray-500"
                              }`}
                            >
                              {message.timestamp}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>

              {/* Message Input */}
              <div className="border-t border-gray-200 p-4">
                {selectedConversation.status === "negotiating" && (
                  <div className="flex gap-2 mb-3 overflow-x-auto">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCounterOffer(35)}
                      className="whitespace-nowrap"
                    >
                      Offer $35
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCounterOffer(38)}
                      className="whitespace-nowrap"
                    >
                      Offer $38
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAcceptOffer(selectedConversation.itemPrice)}
                      className="whitespace-nowrap"
                    >
                      Accept ${selectedConversation.itemPrice}
                    </Button>
                  </div>
                )}

                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                  <Shield className="h-3 w-3" />
                  All transactions are protected by Afriverse escrow
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-3 lg:gap-6 lg:h-[700px]">
          {/* Conversations List */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg">Conversations</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {mockConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation)}
                      className={`p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-100 ${
                        selectedConversation.id === conversation.id ? "bg-blue-50 border-blue-200" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={conversation.sellerAvatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {conversation.sellerName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-gray-900 truncate">{conversation.sellerName}</h4>
                            <span className="text-xs text-gray-500">{conversation.lastMessageTime}</span>
                          </div>

                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={`text-xs ${getStatusColor(conversation.status)}`}>
                              {getStatusIcon(conversation.status)}
                              <span className="ml-1 capitalize">{conversation.status.replace("_", " ")}</span>
                            </Badge>
                          </div>

                          <div className="flex items-center gap-2 mb-2">
                            <Image
                              src={conversation.itemImage || "/placeholder.svg"}
                              alt={conversation.itemTitle}
                              width={24}
                              height={24}
                              className="rounded object-cover"
                            />
                            <span className="text-sm text-gray-600 truncate">{conversation.itemTitle}</span>
                          </div>

                          <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>

                          {conversation.unread && <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            <Card className="h-full flex flex-col">
              {/* Chat Header */}
              <CardHeader className="border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedConversation.sellerAvatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {selectedConversation.sellerName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedConversation.sellerName}</h3>
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs ${getStatusColor(selectedConversation.status)}`}>
                          {getStatusIcon(selectedConversation.status)}
                          <span className="ml-1 capitalize">{selectedConversation.status.replace("_", " ")}</span>
                        </Badge>
                        <span className="text-sm text-gray-500">★ {selectedConversation.sellerRating}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>

                {/* Item Context */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mt-3">
                  <Image
                    src={selectedConversation.itemImage || "/placeholder.svg"}
                    alt={selectedConversation.itemTitle}
                    width={60}
                    height={60}
                    className="rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{selectedConversation.itemTitle}</h4>
                    <p className="text-lg font-bold text-green-600">${selectedConversation.itemPrice}</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Shield className="h-4 w-4" />
                    Afriverse Protected
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id}>
                      {message.type === "system" && (
                        <div className="text-center">
                          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                            <Shield className="h-3 w-3" />
                            {message.message}
                          </div>
                        </div>
                      )}

                      {message.type === "offer" && (
                        <div className="flex justify-center">
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-sm">
                            <div className="text-center mb-3">
                              <div className="text-sm text-gray-600 mb-1">Price Offer</div>
                              <div className="text-2xl font-bold text-green-600">${message.offerAmount}</div>
                              {message.originalPrice && (
                                <div className="text-sm text-gray-500">
                                  Original: <span className="line-through">${message.originalPrice}</span>
                                </div>
                              )}
                            </div>

                            {message.senderId !== "buyer" && (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleAcceptOffer(message.offerAmount!)}
                                  className="flex-1 bg-green-600 hover:bg-green-700"
                                >
                                  Accept
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleCounterOffer(message.offerAmount! - 5)}
                                  className="flex-1"
                                >
                                  Counter
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {message.type === "text" && (
                        <div className={`flex ${message.senderId === "buyer" ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.senderId === "buyer" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                            }`}
                          >
                            <p className="text-sm">{message.message}</p>
                            <p
                              className={`text-xs mt-1 ${
                                message.senderId === "buyer" ? "text-blue-100" : "text-gray-500"
                              }`}
                            >
                              {message.timestamp}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>

              {/* Message Input */}
              <div className="border-t border-gray-200 p-4">
                {selectedConversation.status === "negotiating" && (
                  <div className="flex gap-2 mb-3">
                    <Button size="sm" variant="outline" onClick={() => handleCounterOffer(35)}>
                      Offer $35
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleCounterOffer(38)}>
                      Offer $38
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAcceptOffer(selectedConversation.itemPrice)}
                    >
                      Accept ${selectedConversation.itemPrice}
                    </Button>
                  </div>
                )}

                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                  <Shield className="h-3 w-3" />
                  All transactions are protected by Afriverse escrow
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  )
}
