import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Send, User, Bot, FileText, MessageSquare, Plus, MessageCircle } from 'lucide-react';
import { organizationService } from '../../services/organization.service';
import { chatService } from '../../services/chat.service';
import { ChatResponse } from '../../api/chat';
import ReactMarkdown from 'react-markdown';
import Spinner from '../../components/common/Spinner/Spinner';
import { useAuthStore } from '../../store/authStore';
import { getVisibleOrganizations } from '../../utils/rbac';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  sources?: ChatResponse['sources'];
}

const Chat = () => {
  const [selectedOrgId, setSelectedOrgId] = useState<number | ''>('');
  const [input, setInput] = useState('');

  // State for the ongoing session vs selected historical item
  const [currentSessionMessages, setCurrentSessionMessages] = useState<Message[]>([]);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const { data: organizations } = useQuery({
    queryKey: ['organizations'],
    queryFn: organizationService.getOrganizations,
  });

  const visibleOrganizations = getVisibleOrganizations(organizations, user);

  const { data: historyData, isLoading: isHistoryLoading } = useQuery({
    queryKey: ['chatHistory', selectedOrgId, user?.email],
    queryFn: () => chatService.getHistory(selectedOrgId as number, user?.email),
    enabled: !!selectedOrgId && !!user?.email,
  });

  useEffect(() => {
    if (visibleOrganizations && visibleOrganizations.length > 0 && selectedOrgId === '') {
      setSelectedOrgId(visibleOrganizations[0].id);
    }
  }, [visibleOrganizations, selectedOrgId]);

  // Clear messages when changing organization
  useEffect(() => {
    setCurrentSessionMessages([]);
    setSelectedHistoryId(null);
  }, [selectedOrgId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSessionMessages, selectedHistoryId]);

  const autoResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  const chatMutation = useMutation({
    mutationFn: async (question: string) => {
      let aiMessageId: string | null = null;
      let fullAnswer = '';
      let finalSources: ChatResponse['sources'] | undefined = undefined;

      await chatService.askQuestionStream(
        selectedOrgId as number,
        question,
        (chunk) => {
          if (chunk.text) fullAnswer += chunk.text;
          if (chunk.sources) finalSources = chunk.sources;

          if (!aiMessageId) {
            aiMessageId = Date.now().toString();
            setCurrentSessionMessages((prev) => [
              ...prev,
              {
                id: aiMessageId!,
                role: 'ai',
                content: chunk.text || '',
                sources: chunk.sources
              }
            ]);
          } else {
            setCurrentSessionMessages((prev) =>
              prev.map(msg =>
                msg.id === aiMessageId
                  ? {
                    ...msg,
                    content: chunk.text ? msg.content + chunk.text : msg.content,
                    sources: chunk.sources ? chunk.sources : msg.sources
                  }
                  : msg
              )
            );
          }
        }
      );

      // Save to local history when stream finishes
      if (user?.email && selectedOrgId) {
        chatService.saveLocalHistory(selectedOrgId as number, user.email, question, fullAnswer, finalSources);
      }

      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatHistory', selectedOrgId, user?.email] });
    },
    onError: () => {
      setCurrentSessionMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'ai',
          content: 'Sorry, I encountered an error while trying to answer your question.',
        },
      ]);
    },
  });

  const handleSend = () => {
    if (!input.trim() || !selectedOrgId || chatMutation.isPending) return;

    const question = input.trim();
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    // If viewing history, start a new chat with this question
    if (selectedHistoryId !== null) {
      setSelectedHistoryId(null);
      setCurrentSessionMessages([
        { id: Date.now().toString(), role: 'user', content: question },
      ]);
    } else {
      setCurrentSessionMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: 'user', content: question },
      ]);
    }

    chatMutation.mutate(question);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const startNewChat = () => {
    setSelectedHistoryId(null);
    setCurrentSessionMessages([]);
  };

  // Determine what messages to display
  let displayMessages: Message[] = [];
  if (selectedHistoryId !== null && historyData) {
    const historyItem = historyData.find(item => item.id === selectedHistoryId);
    if (historyItem) {
      displayMessages = [
        { id: `user-${historyItem.id}`, role: 'user', content: historyItem.question },
        { id: `ai-${historyItem.id}`, role: 'ai', content: historyItem.answer, sources: historyItem.sources }
      ];
    }
  } else {
    displayMessages = currentSessionMessages;
  }

  return (
    <div className="flex h-[calc(100vh-134px)] bg-background overflow-hidden border border-border rounded-xl shadow-sm">
      {/* Sidebar for context selection & history */}
      <div className="w-[280px] bg-cards border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <div className="font-semibold text-text-main mb-2">Chat Context</div>
          <select
            className="w-full p-2 border border-border rounded-md bg-background text-text-main mb-4"
            value={selectedOrgId}
            onChange={(e) => setSelectedOrgId(e.target.value === '' ? '' : Number(e.target.value))}
          >
            <option value="" disabled>Select Organization</option>
            {visibleOrganizations?.map((org) => (
              <option key={org.id} value={org.id}>{org.name}</option>
            ))}
          </select>

          <button
            onClick={startNewChat}
            className="w-full flex items-center justify-center gap-2 bg-primary text-white py-2 px-4 rounded-md hover:bg-emerald-700 transition-colors"
          >
            <Plus size={18} />
            <span>New Chat</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
          {selectedOrgId && (
            <div className="text-xs font- old text-text-muted uppercase tracking-wider mb-2 px-2 mt-2">
              Recent Chats
            </div>
          )}

          {isHistoryLoading && selectedOrgId ? (
            <div className="flex justify-center p-4">
              <Spinner />
            </div>
          ) : historyData && historyData.length > 0 ? (
            historyData.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedHistoryId(item.id)}
                className={`flex items-start gap-3 p-3 text-left rounded-lg transition-colors overflow-hidden ${selectedHistoryId === item.id ? 'bg-primary/10 text-primary' : 'hover:bg-border/50 text-text-main'}`}
              >
                <MessageCircle size={18} className="shrink-0 mt-0.5 opacity-70" />
                <div className="truncate text-sm font-medium">
                  {item.question}
                </div>
              </button>
            ))
          ) : selectedOrgId ? (
            <div className="text-sm text-text-muted px-2 py-4 text-center">
              No previous chats found.
            </div>
          ) : null}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-background">
        <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6">
          {displayMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-text-muted">
              <MessageSquare size={48} className="mb-4 opacity-50" />
              <h2>How can I help you today?</h2>
              <p>Ask a question about your organization's documents.</p>
            </div>
          ) : (
            displayMessages.map((msg) => (
              <div key={msg.id} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-white ${msg.role === 'user' ? 'bg-primary' : 'bg-success'}`}>
                    {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                  </div>
                  <div className={`px-6 py-4 rounded-lg leading-relaxed ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-sm' : 'bg-cards border border-border text-text-main rounded-tl-sm'}`}>
                    {msg.role === 'user' ? (
                      <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                    ) : (
                      <div className="w-full break-words">
                        <ReactMarkdown
                          components={{
                            h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mt-4 mb-2 first:mt-0" {...props} />,
                            h2: ({ node, ...props }) => <h2 className="text-xl font-bold mt-4 mb-2 first:mt-0" {...props} />,
                            h3: ({ node, ...props }) => <h3 className="text-lg font-semibold mt-3 mb-2 first:mt-0" {...props} />,
                            p: ({ node, ...props }) => <p className="mb-3 last:mb-0 leading-relaxed" {...props} />,
                            strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
                            ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-3 space-y-1" {...props} />,
                            ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-3 space-y-1" {...props} />,
                            li: ({ node, ...props }) => <li {...props} />,
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    )}

                    {msg.sources && msg.sources.length > 0 && !(chatMutation.isPending && msg.id === displayMessages[displayMessages.length - 1].id) && (
                      <div className="mt-4 pt-4 border-t border-dashed border-border text-sm">
                        <div className="font-semibold mb-2 text-text-muted">Sources:</div>
                        {msg.sources.map((src, idx) => (
                          <div key={idx} className="inline-flex items-center gap-1 bg-background px-2 py-1 rounded-sm border border-border mr-2 mb-2 text-primary">
                            <FileText size={14} />
                            <span>      {src.document} (p. {src.page})</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}

          {chatMutation.isPending && displayMessages[displayMessages.length - 1]?.role === 'user' && (
            <div className={`flex w-full justify-start`}>
              <div className={`max-w-[80%] flex gap-4`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-white bg-success`}>
                  <Bot size={20} />
                </div>
                <div className={`px-6 py-4 rounded-lg leading-relaxed bg-cards border border-border text-text-main rounded-tl-sm`}>
                  <div className="flex items-center py-1">
                    <Spinner size="sm" variant="primary" />
                    <span className="text-sm font-medium text-text-muted ml-3 animate-pulse">Thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-background border-t border-border">
          <div className="max-w-[800px] mx-auto relative flex items-end bg-cards border border-border rounded-lg p-2 shadow-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
            <textarea
              ref={textareaRef}
              className="flex-1 border-none bg-transparent p-2 resize-none min-h-[44px] max-h-[200px] text-text-main font-inherit text-base focus:outline-none"
              placeholder={selectedOrgId ? "Ask a question..." : "Select an organization first"}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                autoResize();
              }}
              onKeyDown={handleKeyDown}
              disabled={!selectedOrgId || chatMutation.isPending}
              rows={1}
            />
            <button
              className="bg-primary text-white border-none w-11 h-11 rounded-md flex items-center justify-center cursor-pointer transition-colors shrink-0 ml-2 hover:bg-emerald-700 disabled:bg-border disabled:text-text-muted disabled:cursor-not-allowed"
              onClick={handleSend}
              disabled={!input.trim() || !selectedOrgId || chatMutation.isPending}
            >
              {chatMutation.isPending ? (
                <Spinner size="sm" variant="white" />
              ) : (
                <Send size={20} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
