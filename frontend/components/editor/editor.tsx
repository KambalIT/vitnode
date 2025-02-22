import { useRef, useState } from 'react';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { InitialConfigType, LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin';

import { OnChangePluginEditor } from './plugins/on-change';
import { AutoLinkPluginEditor } from './plugins/auto-link';
import { ToolbarEditor } from './toolbar/toolbar-editor';
import { cx } from '@/functions/classnames';
import { DraggableBlockPluginEditor } from './plugins/draggable-block';
import { MARKDOWN_TRANSFORMERS_EDITOR } from './markdown-transformers-editor';
import { BLOCK_NAMES, EditorContext } from './toolbar/hooks/use-editor';
import { CodeHighlightPluginEditor } from './plugins/code-highlight';
import { CodeActionMenuPluginEditor } from './plugins/code/code-action-menu';
import { useGlobals } from '@/hooks/core/use-globals';
import { TextLanguage } from '@/graphql/hooks';
import './editor.scss';
import { EmojiPluginEditor } from './plugins/emoji';
import { initialConfigEditor } from './initial-config';

interface Props {
  id: string;
  onChange: (value: TextLanguage[]) => void;
  value: TextLanguage[];
  autoFocus?: boolean;
  className?: string;
  toolbarClassName?: string;
}

export const Editor = ({ autoFocus, className, id, onChange, toolbarClassName, value }: Props) => {
  const [blockType, setBlockType] = useState<string>(BLOCK_NAMES.PARAGRAPH);
  const floatingAnchorElem = useRef<HTMLDivElement>(null);
  const { defaultLanguage } = useGlobals();
  const [selectedLanguage, setSelectedLanguage] = useState(defaultLanguage);

  const initialConfig: InitialConfigType = {
    ...initialConfigEditor,
    namespace: id
  };

  return (
    <EditorContext.Provider value={{ blockType, setBlockType }}>
      <LexicalComposer initialConfig={initialConfig}>
        <div
          className={cx(
            'relative border border-input rounded-md bg-card ring-offset-background',
            className
          )}
        >
          <ToolbarEditor
            className={toolbarClassName}
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
          />
          <OnChangePluginEditor
            value={value}
            onChange={onChange}
            selectedLanguage={selectedLanguage}
          />
          <AutoLinkPluginEditor />
          <CodeHighlightPluginEditor />
          <RichTextPlugin
            contentEditable={
              <div className="relative" ref={floatingAnchorElem}>
                <ContentEditable className="py-4 px-7 border-0 focus:border-0 focus:outline-none min-h-[10rem] resize-y overflow-auto" />
              </div>
            }
            placeholder={null}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <MarkdownShortcutPlugin transformers={MARKDOWN_TRANSFORMERS_EDITOR} />
          {autoFocus && <AutoFocusPlugin />}
          <HistoryPlugin />
          <ListPlugin />
          <CheckListPlugin />
          <TabIndentationPlugin />
          <LinkPlugin />
          <ClearEditorPlugin />
          <EmojiPluginEditor />

          {floatingAnchorElem.current && (
            <>
              <DraggableBlockPluginEditor anchorElem={floatingAnchorElem.current} />
              <CodeActionMenuPluginEditor anchorElem={floatingAnchorElem.current} />
            </>
          )}
        </div>
      </LexicalComposer>
    </EditorContext.Provider>
  );
};
