'use client';
import React, { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Bold, Italic, Strikethrough, AlertTriangle, Smile } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

export const CommentEditor = ({ value, onChange }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = React.useRef(null);
  
  const handleButtonClick = (e, action) => {
    e.preventDefault();
    action();
  };

  const handleFormat = (format) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;

    const formatTags = {
      bold: '**',
      italic: '_',
      strike: '~~',
      spoiler: '||'
    };

    const tag = formatTags[format];
    if (!tag) return;

    const newText = text.slice(0, start) + 
                   tag + 
                   text.slice(start, end) + 
                   tag + 
                   text.slice(end);

    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      if (start === end) {
        textarea.setSelectionRange(start + tag.length, start + tag.length);
      } else {
        textarea.setSelectionRange(start, end + tag.length * 2);
      }
    }, 0);
  };

  const addEmoji = (emoji) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const newText = value.slice(0, start) + emoji.native + value.slice(start);
    onChange(newText);
    
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + emoji.native.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
    
    setShowEmojiPicker(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 p-2 bg-white/[0.02] rounded-t-xl border-b border-white/5">
        <ToggleGroup type="multiple" className="flex gap-1">
          <ToggleGroupItem
            value="bold"
            onMouseDown={(e) => handleButtonClick(e, () => handleFormat('bold'))}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <Bold className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="italic"
            onMouseDown={(e) => handleButtonClick(e, () => handleFormat('italic'))}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <Italic className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="strike"
            onMouseDown={(e) => handleButtonClick(e, () => handleFormat('strike'))}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <Strikethrough className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>

        <div className="w-[1px] h-6 bg-white/5" />

        <button
          type="button"
          onMouseDown={(e) => handleButtonClick(e, () => handleFormat('spoiler'))}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors"
        >
          <AlertTriangle className="h-4 w-4" />
        </button>

        <div className="w-[1px] h-6 bg-white/5" />

        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors"
        >
          <Smile className="h-4 w-4" />
        </button>
      </div>

      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Напишите отзыв..."
          className="min-h-[100px] resize-y bg-white/[0.02] border-0 rounded-t-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        
        {showEmojiPicker && (
          <div className="absolute bottom-full right-0 mb-2">
            <Picker
              data={data}
              onEmojiSelect={addEmoji}
              theme="dark"
              previewPosition="none"
            />
          </div>
        )}
      </div>
    </div>
  );
};
