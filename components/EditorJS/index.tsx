"use client";
import React, { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import NestedList from "@editorjs/nested-list";
import Quote from "@editorjs/quote";
import CodeTool from "@editorjs/code";
import ImageTool from "@editorjs/image";
import Delimiter from "@editorjs/delimiter";
import Table from "@editorjs/table";
// import Embed from "@editorjs/embed";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import "./styles.css";

interface EditorJSProps {
	contentId?: string;
	data?: any;
	onChange?: (data: any) => void;
	onSave?: (data: any) => void;
	readOnly?: boolean;
	placeholder?: string;
	autofocus?: boolean;
	className?: string;
}

const EditorJSComponent: React.FC<EditorJSProps> = ({ contentId, data, onChange, onSave, readOnly = false, placeholder = "Start writing...", autofocus = false }) => {
	const editorRef = useRef<EditorJS | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const [isSaving, setIsSaving] = useState(false);
	const [editorReady, setEditorReady] = useState<boolean>(false);

	useEffect(() => {
		if (!containerRef.current) return;

		if (editorRef.current && !editorReady) return;
		// Destroy previous instance if it exists
		if (editorRef.current) {
			editorRef.current.destroy?.();
			editorRef.current = null;
		}
		const editor = new EditorJS({
			holder: containerRef.current,
			tools: {
				header: Header,
				list: {
					//@ts-ignore
					class: NestedList,
					inlineToolbar: true,
					config: {
						defaultStyle: "unordered",
					},
				},
				quote: {
					class: Quote,
					inlineToolbar: true,
				},
				code: CodeTool,
				image: ImageTool,
				delimiter: Delimiter,
				table: Table,
				// embed: Embed,
			},
			data: data || {},
			readOnly,
			placeholder,
			autofocus,
			onChange: () => {
				if (onChange) {
					editor.save().then((outputData) => {
						onChange(outputData);
					});
				}
			},
		});

		editorRef.current = editor;
	}, [readOnly, contentId]);
	useEffect(() => {
		if (editorReady) return;
		if (editorRef.current?.isReady) {
			editorRef.current.isReady.then(() => setEditorReady(true));
		}
	}, [editorReady, setEditorReady]);

	const handleSave = async () => {
		if (!editorRef.current || !onSave) return;

		try {
			setIsSaving(true);
			const savedData = await editorRef.current.save();
			onSave(savedData);
		} catch (error) {
			console.error("Error saving editor content:", error);
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<div className="editor-js-wrapper">
			<div ref={containerRef} className="min-h-[300px] border rounded-md p-4" />
			{onSave && !readOnly && (
				<div className="mt-4 flex justify-end">
					<Button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2">
						<Save className="h-4 w-4" />
						{isSaving ? "Saving..." : "Save"}
					</Button>
				</div>
			)}
		</div>
	);
};

export default EditorJSComponent;
