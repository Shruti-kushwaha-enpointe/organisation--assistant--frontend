import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Send, User, Bot, FileText, MessageSquare } from 'lucide-react';
import { organizationService } from '../../services/organization.service';
import { chatService } from '../../services/chat.service';
import { ChatResponse } from '../../types/chat';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  sources?: ChatResponse['sources'];
}

const Chat = () => {
  const [selectedOrgId, setSelectedOrgId] = useState<number | ''>('');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { data: organizations } = useQuery({
    queryKey: ['organizations'],
    queryFn: organizationService.getOrganizations,
  });

  useEffect(() => {
    if (organizations && organizations.length > 0 && selectedOrgId === '') {
      setSelectedOrgId(organizations[0].id);
    }
  }, [organizations, selectedOrgId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const autoResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  const chatMutation = useMutation({
    mutationFn: async (question: string) => {
      return chatService.askQuestion(selectedOrgId as number, question);
    },
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'ai',
          content: data.answer,
          sources: data.sources,
        },
      ]);
    },
    onError: () => {
      setMessages((prev) => [
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

    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: 'user', content: question },
    ]);

    chatMutation.mutate(question);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-[calc(100vh-134px)] bg-background overflow-hidden border border-border rounded-xl shadow-sm">
      {/* Sidebar for context selection */}
      <div className="w-[280px] bg-cards border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <div className="font-semibold text-text-main mb-2">Chat Context</div>
          <select
            className="w-full p-2 border border-border rounded-md bg-background text-text-main"
            value={selectedOrgId}
            onChange={(e) => setSelectedOrgId(e.target.value === '' ? '' : Number(e.target.value))}
          >
            <option value="" disabled>Select Organization</option>
            {organizations?.map((org) => (
              <option key={org.id} value={org.id}>{org.name}</option>
            ))}
          </select>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            The AI will only search for answers within the documents uploaded to the selected organization.
          </p>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-background">
        <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-text-muted">
              <MessageSquare size={48} className="mb-4 opacity-50" />
              <h2>How can I help you today?</h2>
              <p>Ask a question about your organization's documents.</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-white ${msg.role === 'user' ? 'bg-primary' : 'bg-success'}`}>
                    {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                  </div>
                  <div className={`px-6 py-4 rounded-lg leading-relaxed ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-sm' : 'bg-cards border border-border text-text-main rounded-tl-sm'}`}>
                    {/* <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div> */}
                    {msg.role === 'user' ? (

                      <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                    ) : (
                      <div className="w-full break-words">
                        <ReactMarkdown
                          components={{
                            // Headings
                            h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mt-4 mb-2 first:mt-0" {...props} />,
                            h2: ({ node, ...props }) => <h2 className="text-xl font-bold mt-4 mb-2 first:mt-0" {...props} />,
                            h3: ({ node, ...props }) => <h3 className="text-lg font-semibold mt-3 mb-2 first:mt-0" {...props} />,

                            // Paragraphs & Text
                            p: ({ node, ...props }) => <p className="mb-3 last:mb-0 leading-relaxed" {...props} />,
                            strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,

                            // Lists
                            ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-3 space-y-1" {...props} />,
                            ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-3 space-y-1" {...props} />,
                            li: ({ node, ...props }) => <li {...props} />,
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    )}

                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-dashed border-border text-sm">
                        <div className="font-semibold mb-2 text-text-muted">Sources:</div>
                        {msg.sources.map((src, idx) => (
                          <div key={idx} className="inline-flex items-center gap-1 bg-background px-2 py-1 rounded-sm border border-border mr-2 mb-2 text-primary">
                            <FileText size={14} />
                            <span>{src.document} (p. {src.page})</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}

          {chatMutation.isPending && (
            <div className={`flex w-full justify-start`}>
              <div className={`max-w-[80%] flex gap-4`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-white bg-success`}>
                  <Bot size={20} />
                </div>
                <div className={`px-6 py-4 rounded-lg leading-relaxed bg-cards border border-border text-text-main rounded-tl-sm`}>
                  <div className="flex items-center gap-1 py-1">
                    <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '-0.32s' }}></div>
                    <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '-0.16s' }}></div>
                    <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce"></div>
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
              className="bg-primary text-white border-none w-11 h-11 rounded-md flex items-center justify-center cursor-pointer transition-colors shrink-0 ml-2 hover:bg-blue-700 disabled:bg-border disabled:text-text-muted disabled:cursor-not-allowed"
              onClick={handleSend}
              disabled={!input.trim() || !selectedOrgId || chatMutation.isPending}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
