// src/lib/ai/tools/ToolRegistry.ts
import { AITool, AIToolDefinition } from './AITool';
import { GenerateNotesTool } from './tools/CourseControl/GenerateNotes';
import { GenerateQuizTool } from './tools/CourseControl/GenerateQuiz';
import { NextChapterTool } from './tools/CourseControl/NextChapter';
import { MemoryQueryTool } from './tools/RetriveMemory';
import { EndSessionTool } from './tools/SessionControl/EndSession';

export class ToolRegistry {
    private tools: Map<string, AITool> = new Map();

    /**
     * Register a tool with the registry
     * @param tool The tool to register
     */
    registerTool(tool: AITool): this {
        this.tools.set(tool.name, tool);
        return this;
    }

    /**
     * Get a registered tool by name
     * @param name The name of the tool to get
     */
    getTool(name: string): AITool | undefined {
        return this.tools.get(name);
    }

    /**
     * Get all registered tools
     */
    getAllTools(): AITool[] {
        return Array.from(this.tools.values());
    }

    /**
     * Get AI tool definitions for all registered tools
     */
    getToolDefinitions(): AIToolDefinition[] {
        return Array.from(this.tools.values()).map(tool => tool.getDefinition());
    }

    /**
     * Execute a tool by name with the given parameters
     * @param name The name of the tool to execute
     * @param params The parameters to pass to the tool
     */
    async executeTool(name: string, params: Record<string, any>, context: any): Promise<any> {
        const tool = this.tools.get(name);
        if (!tool) {
            throw new Error(`Tool not found: ${name}`);
        }

        return await tool.execute(params, context);
    }
}

// Create a singleton instance
const toolRegistry = new ToolRegistry();

toolRegistry.registerTool(new MemoryQueryTool());
toolRegistry.registerTool(new EndSessionTool());
toolRegistry.registerTool(new NextChapterTool());
toolRegistry.registerTool(new GenerateQuizTool());
toolRegistry.registerTool(new GenerateNotesTool());

export { toolRegistry }